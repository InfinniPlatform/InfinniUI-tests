'use strict';

module.exports = function( argv ) {
    var result = {};

    for( var i = 0, ii = argv.length; i < ii; i++ ) {
        var regex = argv[ i ].replace( /"/g, '' ).match( /^--(\w+):([\s\S]*)$/ );

        if( !regex || regex.length !== 3 ) {
            continue;
        }

        result[ regex[ 1 ] ] = regex[ 2 ];
    }

    return result;
};
