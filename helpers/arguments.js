'use strict';

/**
 *
 * @param result
 * @param arg
 * @returns {*}
 */
module.exports = function( result, arg ) {
    var regex = arg.replace( /"/g, '' ).match( /^--(\w+):([\s\S]*)$/ );

    if( regex || regex.length === 3 ) {
        result[ regex[ 1 ] ] = regex[ 2 ];
    }

    return result;
};
