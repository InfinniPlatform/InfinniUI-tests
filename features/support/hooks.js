'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var cucumber = require( 'cucumber' );
var sanitize = require( 'sanitize-filename' );

cucumber.defineSupportCode( function( consumer ) {

    consumer.After( function( scenario, callback ) {
        if( scenario.isFailed() ) {
            this.driver.takeScreenshot().then( function( data ) {
                var base64Data = data.replace( /^data:image\/png;base64,/, '' );
                var fullPath = path.join( 'screenshots', sanitize( scenario.getName() + '.png' ).replace( / /g, '_' ) );

                fs.writeFile( fullPath, base64Data, 'base64', function( err ) {
                    if( err ) {
                        console.log( err );
                    }
                } );
            } );
        }

        return this.driver.manage().deleteAllCookies();
    } );

    consumer.registerHandler( 'AfterFeatures', function( feature, callback ) {
        return this.driver.quit();
    } );

    consumer.registerHandler( 'BeforeStep', function( step, callback ) {
        var totalAttempts = 60;
        var driver = this.driver;
        var by = this.by;

        driver.manage().setTimeouts( undefined, undefined, process.myConfig.timeouts.wait );

        tryContinue( 0 );

        function tryContinue( i ) {
            driver.findElements( by.xpath( './/div[contains(@class, "blockPage")]' ) )
                .then( function( elements ) {
                    if( !elements.length ) {
                        driver.manage().setTimeouts( undefined, undefined, process.myConfig.timeouts.main );
                        callback();
                    } else {
                        if( i < totalAttempts ) {
                            setTimeout( function() {
                                tryContinue( ++i );
                            }, 1000 );
                        } else {
                            throw new Error( 'Блокирование страницы индикатором загрузки более чем на ' + totalAttempts + ' сек.' );
                        }
                    }
                } );
        }
    } );

    try {
        require( process.myConfig.extension ).call( this, driver );
    } catch( err ) {
        console.log( 'Extensions not found' );
    }

} );
