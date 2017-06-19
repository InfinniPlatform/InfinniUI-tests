'use strict';

var teamcity = require( '../../helpers/teamcityFormatter' );

module.exports = function() {
    if( process.myConfig.userOptions.teamcity ) {
        teamcity.call( this );
    }
};
