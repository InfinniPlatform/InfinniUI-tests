'use strict';

var teamcity = require( '../../helpers/teamcityFormatter' );

module.exports = function() {
    if( process.userOptions.teamcity ) {
        teamcity.call( this );
    }
};
