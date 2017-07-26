var defaultConfig = require( './config' );
var userArgsParser = require( './helpers/arguments' );

var configFileOpt = '--config-file:';
var userArgs = {};
var customConfig = {};
var cliConfig = {};

var addCustomConfigFile = function( param ) {
    try {
        customConfig = require( '../..' + param.slice( configFileOpt.length ) );
    } catch( e ) {
        console.error( e );
    }
};

var parseArgvs = function() {
    var argvs = process.argv.slice( 2 );

    for( var i = 0; i < argvs.length; i += 1 ) {
        var elementsCount = 1;
        var param = argvs[ i ];

        if( param.indexOf( configFileOpt ) !== -1 ) {
            addCustomConfigFile( param );
        } else if( param.indexOf( ':' ) !== -1 ) {
            userArgsParser( userArgs, param );
        } else if( param.indexOf( '--' ) !== -1 ) {
            cliConfig[ param ] = argvs[ i + 1 ];
            elementsCount = 2;
        }

        argvs.splice( i, elementsCount );
        i -= 1;
    }
};

var clearArgvs = function() {
    while( process.argv.length > 2 ) {
        process.argv.pop();
    }
};

var merge = function( source, dest ) {
    for( var key in source ) {
        if( !source.hasOwnProperty( key ) ) {
            continue;
        }

        var paramSrc = source[ key ];
        var paramDest = dest[ key ];

        if( typeof paramDest === 'undefined' ) {
            dest[ key ] = paramSrc;
            continue;
        }

        if( Array.isArray( paramSrc ) && Array.isArray( paramDest ) ) {
            for( var i = 0, ii = paramSrc.length; i < ii; i++ ) {
                if( paramDest.indexOf( paramSrc[ i ] ) === -1 ) {
                    paramDest.push( paramSrc[ i ] );
                }
            }
            continue;
        }

        if( typeof paramSrc === 'object' && typeof paramDest === 'object' ) {
            dest[ key ] = merge( paramSrc, paramDest );
        }
    }

    return dest;
};

var fillArgv = function( mergedConfig ) {
    var options = mergedConfig.options;
    var folders = mergedConfig.folders;
    var root = mergedConfig.userOptions.root;

    if( root ) {
        process.argv.push( root );
    }

    for( var key in options ) {
        if( options.hasOwnProperty( key ) ) {
            process.argv.push( key );
            process.argv.push( options[ key ] );
        }
    }

    folders.forEach( function( folder ) {
        process.argv.push( '--require' );
        process.argv.push( folder );
    } );
};

var overrideProps = function( dest, source ) {
    for( var key in source ) {
        if( source.hasOwnProperty( key ) ) {
            dest[ key ] = source[ key ];
        }
    }
};

var buildConfig = function() {
    var mergedConfig = merge( defaultConfig, customConfig );

    overrideProps( mergedConfig.options, cliConfig );
    overrideProps( mergedConfig.userOptions, userArgs );

    fillArgv( mergedConfig );

    // add config to global variable
    process.myConfig = mergedConfig;
};

var startTests = function() {
    require( 'cucumber/bin/cucumber' );
};

parseArgvs();
clearArgvs();
buildConfig();
startTests();
