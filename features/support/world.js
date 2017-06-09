'use strict';

var fs = require( 'fs' );
var webdriver = require( 'selenium-webdriver' );
var chai = require( 'chai' );
var underscore = require( 'underscore' );
var args = require( '../../helpers/arguments.js' )( process.argv.slice( 2 ) );
var selectors = require( '../../helpers/selectors.js' );
var helpers = require( '../../helpers/helpers.js' );
var config = require( '../../config.js' );

var By = webdriver.By;
var until = webdriver.until;

var capabilities = {
    chrome: function() {
        return webdriver.Capabilities.chrome();
    },
    phantomjs: function() {
        var caps = webdriver.Capabilities.phantomjs();

        if( args.phantomjs ) {
            caps.set( 'phantomjs.binary.path', args.phantomjs );
        }

        return caps;
    }
};

var buildChromeDriver = function() {
    return new webdriver.Builder()
        .withCapabilities( capabilities.chrome() )
        .build();
};

var buildFirefoxDriver = function() {
    var firefox = require( 'selenium-webdriver/firefox' );
    var profile = new firefox.Profile( 'C:\\firefoxProfile' );
    var options = new firefox.Options().setProfile( profile );

    return new firefox.Driver( options );
};

var buildPhantomDriver = function() {
    return new webdriver.Builder()
        .withCapabilities( capabilities.phantomjs() )
        .build();
};

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

var buildDriver = function( browserName ) {
    var driver = new webdriver.Builder().forBrowser( browserName, config.browsers[ browserName ].version );

    driver = setOptionsForDriver( driver, browserName );
    driver.build();

    return driver;
};

var getDriver = function() {
    return driver;
};

var World = function() {
    var screenshotPath = 'screenshots';

    this.webdriver = webdriver;
    this.driver = driver;
    this.by = By;
    this.selectors = selectors;
    this.helpers = helpers;
    this.assert = chai.assert;
    this._ = underscore;
    this.keys = webdriver.Key;
    this.selectAll = this.keys.chord( this.keys.CONTROL, 'a' );
    this.currentView = null;

    this.driver.manage().setTimeouts( undefined, undefined, config.timeouts.main );

    if( !args.teamcity && !args.width && !args.height ) {
        this.driver.manage().window().maximize();
    } else {
        var width = args.width ? parseInt( args.width, 10 ) : config.screen.width;
        var height = args.height ? parseInt( args.height, 10 ) : config.screen.height;
        this.driver.manage().window().setSize( width, height );
    }

    if( !fs.existsSync( screenshotPath ) ) {
        fs.mkdirSync( screenshotPath );
    }
};

var driver = buildDriver( args.platform );

module.exports.World = World;
module.exports.getDriver = getDriver;
module.exports.By = webdriver.By;
