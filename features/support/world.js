'use strict';

var fs = require( 'fs' );
var webdriver = require( 'selenium-webdriver' );
var chai = require( 'chai' );
var underscore = require( 'underscore' );
var cucumber = require( 'cucumber' );

var selectors = require( '../../helpers/selectors' );
var helpers = require( '../../helpers/helpers' );
var config = process.myConfig;

var browsers = {
    chrome: require( 'selenium-webdriver/chrome' ),
    firefox: require( 'selenium-webdriver/firefox' ),
    opera: require( 'selenium-webdriver/opera' ),
    ie: require( 'selenium-webdriver/ie' ),
    edge: require( 'selenium-webdriver/edge' ),
    safari: require( 'selenium-webdriver/safari' ),
    phantomjs: require( 'selenium-webdriver/phantomjs' )
};

webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger( 'promise.ControlFlow' ).setLevel( webdriver.logging.Level.ALL );

process.env[ 'SELENIUM_PROMISE_MANAGER' ] = 0;

cucumber.defineSupportCode( function( consumer ) {
    consumer.setWorldConstructor( CustomWorld );
} );

/**
 *
 * @constructor
 */
var CustomWorld = function( consumer ) {
    var screenshotPath = config.screenshotsFolder;

    this.attach = consumer.attach;
    this.parametrs = consumer.parametrs;

    this.config = config;
    this.webdriver = webdriver;
    this.driver = buildDriver( config.userOptions.browser || config.defaultBrowserName, config );
    this.by = webdriver.By;
    this.selectors = selectors;
    this.helpers = helpers;
    this.assert = chai.assert;
    this._ = underscore;
    this.keys = webdriver.Key;
    this.selectAll = this.keys.chord( this.keys.CONTROL, 'a' );
    this.currentView = null;

    if( !config.userOptions.teamcity && !config.userOptions.width && !config.userOptions.height ) {
        this.driver.manage().window().maximize();
    } else {
        var width = config.userOptions.width ? parseInt( config.userOptions.width, 10 ) : config.screen.width;
        var height = config.userOptions.height ? parseInt( config.userOptions.height, 10 ) : config.screen.height;

        this.driver.manage().window().setSize( width, height );
    }

    if( typeof screenshotPath !== 'undefined' && !fs.existsSync( screenshotPath ) ) {
        fs.mkdirSync( screenshotPath );
    }

    process.world = this;
};

/**
 *
 * @param driver
 * @param browserName
 * @param browserConfig
 * @returns {Builder}
 */
var setOptionsForDriver = function( driver, browserName, browserConfig ) {
    var options = createBrowserConfig( browserName, browserConfig );

    switch( browserName ) {
        case 'chrome':
            driver.setChromeOptions( options );
            break;
        case 'firefox':
            driver.setFirefoxOptions( options );
            break;
        case 'opera':
            driver.setOperaOptions( options );
            break;
        case 'edge':
            driver.setEdgeOptions( options );
            break;
        case 'ie':
            driver.setIeOptions( options );
            break;
        case 'safari':
            driver.setSafariOptions( options );
            break;
        case 'phantomjs':
            for( var key in options ) {
                if( options.hasOwnProperty( key ) ) {
                    driver.set( key, options[ key ] );
                }
            }
            break;
        default:
            break;
    }

    return driver;
};

/**
 *
 * @param browserName
 * @param config
 * @returns {Builder}
 */
var buildDriver = function( browserName, config ) {
    var browserConfig = config.browsers[ browserName ];
    var driver = new webdriver.Builder().forBrowser( browserName, browserConfig.version );

    if( typeof browsers[ browserName ] === 'undefined' ) {
        throw new Error( 'Invalid platform ' + ( browserName || '' ) + '' );
    }

    driver = setOptionsForDriver( driver, browserName, browserConfig );

    return driver.build();
};

/**
 *
 * @param name
 * @param config
 * @returns {Options}
 */
var createBrowserConfig = function( name, config ) {
    if( name === 'phantomjs' ) {
        return config;
    }

    var options = new browsers[ name ].Options();

    for( var key in config ) {
        if( config.hasOwnProperty( key ) && typeof options[ key ] === 'function' ) {
            options[ key ]( config[ key ] );
        }
    }

    return options;
};
