var path = require( 'path' );

module.exports = {

    timeouts: {
        main: 10000,
        wait: 10
    },

    defaultBrowserName: 'chrome',

    // absolute path to screenshots folder
    screenshotsFolder: path.resolve( __dirname, 'screenshots' ),

    screen: {
        width: 1920,
        height: 1080
    },

    // browsers options for webdriver
    browsers: {
        chrome: {
            addArguments: [ '--test-type' ]
        },
        firefox: {

        },
        opera: {

        },
        ie: {

        },
        edge: {

        },
        safari: {

        },
        phantomjs: {
            // 'phantomjs.binary.path': 'some_path'
        }
    },

    // folder for search by cucumber
    folders: [
        path.resolve( __dirname, 'features' ) // folder with default files
    ],

    // all user options goes here
    userOptions: {
        // host: 'http://localhost:8080',
        // browser: 'browser_name',
        // teamcity: true,
        // width: 'some_width',
        // height: 'some_height',
    },

    // all cucumber options goes here
    options: {
        '--tags': 'not @ignore',
        '--format': 'summary'
    }

};
