'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    consumer.setDefaultTimeout( 60 * 1000 );
} );
