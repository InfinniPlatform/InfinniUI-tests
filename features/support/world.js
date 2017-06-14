'use strict';

var fs = require( 'fs' );
var webdriver = require( 'selenium-webdriver' );
var chai = require( 'chai' );
var underscore = require( 'underscore' );
var cucumber = require( 'cucumber' );

var selectors = require( '../../helpers/selectors' );
var helpers = require( '../../helpers/helpers' );
var by = webdriver.By;
var config = process.myConfig;

cucumber.defineSupportCode( function( consumer ) {
    consumer.setWorldConstructor( CustomWorld );
} );

/**
 *
 * @constructor
 */
var CustomWorld = function( consumer ) {
    var screenshotPath = 'screenshots';

    this.attach = consumer.attach;
    this.parametrs = consumer.parametrs;

    this.config = config;
    this.webdriver = webdriver;
    this.driver = buildDriver( config.userOptions.browser || config.defaultBrowserName );
    this.by = by;
    this.selectors = selectors;
    this.helpers = helpers;
    this.assert = chai.assert;
    this._ = underscore;
    this.keys = webdriver.Key;
    this.selectAll = this.keys.chord( this.keys.CONTROL, 'a' );
    this.currentView = null;

    this.driver.manage().setTimeouts( undefined, undefined, config.timeouts.main );

    if( !config.userOptions.teamcity && !config.userOptions.width && !config.userOptions.height ) {
        this.driver.manage().window().maximize();
    } else {
        var width = config.userOptions.width ? parseInt( config.userOptions.width, 10 ) : config.screen.width;
        var height = config.userOptions.height ? parseInt( config.userOptions.height, 10 ) : config.screen.height;

        this.driver.manage().window().setSize( width, height );
    }

    if( !fs.existsSync( screenshotPath ) ) {
        fs.mkdirSync( screenshotPath );
    }
};

/**
 *
 * @param driver
 * @param browserName
 * @returns {Builder}
 */
var setOptionsForDriver = function( driver, browserName ) {
    switch( browserName ) {
        case 'chrome':
            driver.setChromeOptions(); // add options params
            break;
        case 'firefox':
            driver.setFirefoxOptions();
            break;
        case 'opera':
            driver.setOperaOptions();
            break;
        case 'edge':
            driver.setEdgeOptions();
            break;
        case 'ie':
            driver.setIeOptions();
            break;
        case 'safari':
            driver.setSafariOptions();
            break;
        case 'phantomjs':
            driver.set( 'phantomjs.binary.path', config.browsers[ browserName ].binaryPath );
            break;
        default:
            if( browserName ) {
                throw new Error( 'Invalid platform ' + ( browserName || '' ) + '' );
            } else {
                return setOptionsForDriver( driver, config.defaultBrowserName );
            }
    }

    return driver;
};

/**
 *
 * @param browserName
 * @returns {Builder}
 */
var buildDriver = function( browserName ) {
    var driver = new webdriver.Builder().forBrowser( browserName, config.browsers[ browserName ].version );

    driver = setOptionsForDriver( driver, browserName );
    driver.build();

    return driver;
};
