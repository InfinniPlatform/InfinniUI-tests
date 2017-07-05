'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var cucumber = require( 'cucumber' );
var sanitize = require( 'sanitize-filename' );

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

        return this.driver.get( process.myConfig.userOptions.host )
            .then( function() {
                return that.driver.manage().setTimeouts( {
                    implicit: that.config.timeouts.main
                } );
            } );
    } );

    if( process.myConfig.checkLoader ) {
        consumer.registerHandler( 'BeforeStep', function() {
            var divider = 2;
            var totalAttempts = 60 * divider;
            var world = process.world;
            var secondTime = false;

            return world.driver.manage().setTimeouts( { implicit: 0 } )
                .then( function() {
                    return new Promise( function( resolve, reject ) {
                        tryContinue( 0, resolve, reject );
                    } );
                } );

            function tryContinue( i, resolve, reject ) {
                var blocker = world.by.xpath( world.selectors.XPATH.UIBlocker.name() );

                world.driver.findElements( blocker )
                    .then( function( elements ) {
                        if( !elements.length && secondTime ) {
                            return world.driver.manage().setTimeouts( { implicit: world.config.timeouts.main } )
                                .then( function() {
                                    resolve();
                                } );
                        } else {
                            secondTime = true;
                            if( i < totalAttempts ) {
                                setTimeout( function() {
                                    tryContinue( i + 1, resolve, reject );
                                }, 1000 / divider );
                            } else {
                                reject( 'Блокирование страницы индикатором загрузки более чем на ' + totalAttempts / divider + ' сек.' );
                            }
                        }
                    } );
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
