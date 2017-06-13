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
    options: {
        folder: [
            path.resolve( __dirname, 'features' )
        ],
        '--tags': '~@ignore',
        '--format': 'summary'
    }
};
