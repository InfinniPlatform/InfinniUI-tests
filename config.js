var path = require( 'path' );

module.exports = {

    timeouts: {
        main: 10000,
        wait: 10
    },

    defaultBrowserName: 'firefox',

    screen: {
        width: 1920,
        height: 1080
    },

    // browsers options for webdriver
    browsers: {
        chrome: {

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
            // binaryPath: 'some_path'
        }
    },

    // folder for search by cucumber
    folders: [
        path.resolve( __dirname, 'features' ) // folder with default files
    ],

    // path to extension file
    extension: '',

    // all user options goes here
    userOptions: {
        // browser: 'browser_name',
        // teamcity: true,
        // width: 'some_width',
        // height: 'some_height',
    },

    // all cucumber options goes here
    options: {
        '--tags': '~@ignore',
        '--format': 'summary'
    }

};
