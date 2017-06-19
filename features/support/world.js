'use strict';

var fs = require( 'fs' );
var webdriver = require( 'selenium-webdriver' );
var chai = require( 'chai' );
var underscore = require( 'underscore' );
var cucumber = require( 'cucumber' );

var selectors = require( '../../helpers/selectors' );
var helpers = require( '../../helpers/helpers' );
var config = process.myConfig;

var chrome = require( 'selenium-webdriver/chrome' );

webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger('promise.ControlFlow').setLevel(webdriver.logging.Level.ALL);

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

    if( !fs.existsSync( screenshotPath ) ) {
        fs.mkdirSync( screenshotPath );
    }

    process.world = this;
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
            var options = new chrome.Options().addArguments( '--ignore-certificate-errors' );
            driver.setChromeOptions( options );
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

    return driver.build();
};
