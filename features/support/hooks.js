'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var cucumber = require( 'cucumber' );
var sanitize = require( 'sanitize-filename' );

cucumber.defineSupportCode( function( consumer ) {

    consumer.After( function( scenarioResult ) {
        var that = this;

        if( scenarioResult.isFailed() ) {
            return this.driver.takeScreenshot()
                .then( function( data ) {
                    var base64Data = data.replace( /^data:image\/png;base64,/, '' );
                    var fullPath = path.join( 'screenshots', sanitize( scenarioResult.name + '.png' ).replace( / /g, '_' ) );

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
                    return clearAndQuit( that.driver );
                } )
                .catch( function( err ) {
                    console.log( err );
                } );
        }

        return clearAndQuit( this.driver );
    } );

    consumer.Before( function( scenarioResult ) {
        return this.driver.get( 'http://localhost:' + ( process.myConfig.userOptions.port || '8080' ) );
    } );

    consumer.registerHandler( 'BeforeStep', function() {
        var divider = 2;
        var totalAttempts = 60 * divider;
        var world = process.world;
        var secondTime = false;

        return new Promise( function( resolve, reject ) {
            tryContinue( 0, resolve, reject );
        } );

        function tryContinue( i, resolve, reject ) {
            var blocker = world.by.xpath( world.selectors.XPATH.UIBlocker.name() );

            world.driver.findElements( blocker )
                .then( function( elements ) {
                    if( !elements.length && secondTime ) {
                        resolve();

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

} );

var clearAndQuit = function( driver ) {
    return driver.manage().deleteAllCookies()
        .then( function() {
            return driver.quit();
        } );
};
