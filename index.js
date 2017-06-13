var _ = require( 'underscore' );
var defaultConfig = require( './config' );
var customConfig;
var cliConfig;
var configFileOpt = '--config-file:';

var addCustomConfig = function( param ) {
    try {
        customConfig = require( param.slice( configFileOpt.length ) );
    } catch ( e ) {
        console.error( e );
    }
};

var parseArgvs = function() {
    var argvs = process.argv.slice( 2 );

    for( var i = 0, ii = argvs.length; i < ii; i += 1 ) {
        var param = argvs[ i ];

        if( param.indexOf( configFileOpt ) !== -1 ) {
            addCustomConfig( param );
            i -= 1;
            argvs.splice( i, 1 );
        } else if( param.indexOf( '--' ) !== -1 ) {
            cliConfig[ param ] = argvs[ i + 1 ];

            i -= 1;
            argvs.splice( i, 2 );
        }
    }

    console.log( customConfig );
    console.log( cliConfig );
};

var clearArgvs = function() {
    while( process.argv.length > 2 ) {
        process.argv.pop();
    }
};

var merge = function( dest, source ) {
    for( var key in source ) {
        if( source.hasOwnProperty( key ) ) {
            var paramSrc = source[ key ];
            var paramDest = dest[ key ];

            if( Array.isArray( paramSrc ) ) {
                for( var i = 0, ii = paramSrc; i < ii; i += 1 ) {
                    if( paramDest.indexOf( paramSrc[ i ] ) === -1 ) {
                        paramDest.push( paramSrc[ i ] );
                    }
                }
            } else if( typeof paramSrc === 'object' && paramSrc !== null ) {
                dest[ key ] = merge( paramDest, paramSrc );
            } else if( paramSrc !== paramDest ) {
                dest[ key ] = paramSrc;
            }
        }
    }

    return dest;
};

var fillArgv = function( argvs ) {
    for( var key in argvs ) {
        if( argvs.hasOwnProperty( key ) ) {
            process.argv.push( key );
            process.argv.push( argvs[ key ] );
        }
    }
};

var buildConfig = function() {
    var mergedConfig = merge( defaultConfig, customConfig );

    for( var key in cliConfig ) {
        if( cliConfig.hasOwnProperty( key ) ) {
            mergedConfig.options[ key ] = cliConfig[ key ];
        }
    }

    fillArgv( mergedConfig.options );
    process.myConfig = mergedConfig;
};

var startTests = function() {
    var npm = require( 'npm' );

    npm.load( './node_modules/cucumber/bin/cucumber.js' );
};

parseArgvs();
clearArgvs();
buildConfig();
startTests();
