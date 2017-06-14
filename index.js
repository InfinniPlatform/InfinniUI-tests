var defaultConfig = require( './config' );
var userArgsParser = require( './helpers/arguments' );

var configFileOpt = '--config-file:';
var userArgs = {};
var customConfig = {};
var cliConfig = {};

var addCustomConfigFile = function( param ) {
    try {
        customConfig = require( '../..' + param.slice( configFileOpt.length ) );
    } catch ( e ) {
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

    console.log( 'customConfig -> ', customConfig );
    console.log( '\n\n' );
    console.log( 'cliConfig -> ', cliConfig );
    console.log( '\n\n' );
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
                for( var i = 0, ii = paramSrc.length; i < ii; i += 1 ) {
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

var fillArgv = function( mergedConfig ) {
    var options = mergedConfig.options;
    var folders = mergedConfig.folders;

    folders.forEach( function( folder ) {
        process.argv.push( folder );
    } );

    for( var key in options ) {
        if( options.hasOwnProperty( key ) ) {
            process.argv.push( key );
            process.argv.push( options[ key ] );
        }
    }
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
