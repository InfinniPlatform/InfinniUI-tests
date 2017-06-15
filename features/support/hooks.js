'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var cucumber = require( 'cucumber' );
var sanitize = require( 'sanitize-filename' );

cucumber.defineSupportCode( function( consumer ) {

    consumer.After( function( scenario, callback ) {
        if( scenario.isFailed() ) {
            this.driver.takeScreenshot()
                .then( function( data ) {
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
        // now here no World instance in this
        callback();
    } );

    consumer.Before( function( scenarioResult, callback ) {
        this.driver.get( 'http://localhost:' + ( process.myConfig.userOptions.port || '8080' ) );
    } );

} );
