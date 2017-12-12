'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var cucumber = require( 'cucumber' );
var sanitize = require( 'sanitize-filename' );
var command = require('selenium-webdriver/lib/command');

cucumber.defineSupportCode( function( consumer ) {

    consumer.After( function( scenarioResult ) {
        var that = this;

        if( typeof that.config.screenshotsFolder !== 'undefined' && scenarioResult.isFailed() ) {
            return this.driver.takeScreenshot()
                .then( function( data ) {
                    var base64Data = data.replace( /^data:image\/png;base64,/, '' );
                    var imageName = sanitize( scenarioResult.scenario.name + '.png' ).replace( / /g, '_' );
                    var fullPath = path.join( that.config.screenshotsFolder, imageName );

                    return new Promise( function( resolve, reject ) {
                        fs.writeFile( fullPath, base64Data, 'base64', function( err ) {
                            if( err ) {
                                console.log( err );
                                reject( err );
                            }

                            resolve();
                        } );
                    } );
                } )
                .then( function() {
                    if( that.config.deleteAllCookiesAndExitAfter ) {
                        return clearAndQuit( that.driver );
                    }
                } );
        }

        if( this.config.deleteAllCookiesAndExitAfter ) {
            return clearAndQuit( this.driver );
        }
    } );

    consumer.Before( function() {
        var that = this;
        var config = this.config;

        return this.driver.get( config.userOptions.host )
            .then( function() {
                return that.driver.manage().setTimeouts( {
                    implicit: config.timeouts.main
                } );
            } )
            .then( function() {
                if( that.currentBrowser === 'chrome' && ~config.browsers.chrome.addArguments.indexOf( '--headless' ) ) {
                    return enableDownloadInHeadlessChrome( that.driver, process.downloadDir );
                }
            } );
    } );

    if( process.myConfig.checkLoader ) {
        consumer.registerHandler( 'BeforeStep', function( scenarioResult ) {
            if( scenarioResult.scenario.__failed ) {
                return;
            }

            var driver = process.world.driver;
            var blockerXpath = process.world.by.xpath( process.world.selectors.XPATH.UIBlocker.name() );
            var totalAttempts = 30;
            var searchAttempt = 0;

            return driver.manage().setTimeouts( { implicit: 0 } )
                .then( function() {
                    return new Promise( function( resolve ) {
                        trySearch( resolve );
                    } );
                } )
                .then( function() {
                    return driver.manage().setTimeouts( {
                        implicit: process.myConfig.timeouts.main
                    } );
                } );

            function trySearch( resolve ) {
                if( searchAttempt === totalAttempts ) {
                    console.error( 'UIBlocker is present after ' + totalAttempts + 's' );
                    scenarioResult.scenario.__failed = true;
                    resolve();
                } else {
                    searchAttempt++;
                    driver.findElements( blockerXpath ).then( function( elements ) {
                        if( !elements.length ) {
                            resolve();
                        } else {
                            setTimeout( function() {
                                trySearch( resolve );
                            }, 1000 );
                        }
                    } );
                }
            }
        } );
    }

} );

var clearAndQuit = function( driver ) {
    return driver.manage().deleteAllCookies()
        .then( function() {
            return driver.quit();
        } );
};

var enableDownloadInHeadlessChrome = function( driver, downloadDir ) {
    // add missing support for chrome "send_command"  to selenium webdriver
    driver.getExecutor().defineCommand( 'send_command', 'POST', '/session/:sessionId/chromium/send_command' );

    var params = {
        'cmd': 'Page.setDownloadBehavior',
        'params': {
            'behavior': 'allow',
            'downloadPath': downloadDir
        }
    };

    return driver.schedule( new command.Command( 'send_command' ).setParameters( params ), 'send_command' );
};
