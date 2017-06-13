var currentScenario;
var translit = require( 'translitit-cyrillic-russian-to-latin' );
var consts = require( './constants.json' ).teamCityFormatter.stepResult;
var helpers = require( './helpers' );

/**
 *
 * @param event
 * @param callback
 * @returns {*}
 */
var handleStepResult = function( event, callback ) {
    var stepResult = event.getPayloadItem( 'stepResult' );

    helpers.fixStepResult( stepResult );

    if( !stepResult.isSuccessful() && !stepResult.isPending() &&
        !stepResult.isSkipped() && !stepResult.isUndefined() ) {

        var failMessage = stepResult.getFailureException();

        if( failMessage ) {
            var translitedStr = translit( failMessage.stack || failMessage );
            var name = helpers.modifyString( translitedStr );
            var message = helpers.replaceInOrder( consts.testFailed1, currentScenario, name );
            helpers.logError( message );
        }

        return callback();
    }

    helpers.asyncCall( callback );
};

/**
 *
 * @param event
 * @param callback
 */
var handleBeforeFeature = function( event, callback ) {
    var feature = event.getPayloadItem( 'feature' );
    var translitedStr = translit( getTag( feature ) + feature.getName() );
    var name = helpers.modifyString( translitedStr );
    var message = helpers.replaceInOrder( consts.testSuitStarted1, name );

    helpers.logError( message );
    helpers.asyncCall( callback );
};
/**
 *
 * @param event
 * @param callback
 */
var handleAfterFeature = function( event, callback ) {
    var feature = event.getPayloadItem( 'feature' );
    var translitedStr = translit( getTag( feature ) + feature.getName() );
    var name = helpers.modifyString( translitedStr );
    var message = helpers.replaceInOrder( consts.testSuitFinished1, name );

    helpers.log( message );
    helpers.asyncCall( callback );
};

/**
 *
 * @param event
 * @param callback
 */
var handleBeforeScenario = function( event, callback ) {
    var scenario = event.getPayloadItem( 'scenario' );
    var translitedStr = translit( getTag( scenario ) + scenario.getName() );
    var name = helpers.modifyString( translitedStr );
    var message = helpers.replaceInOrder( consts.testStarted1, name );

    currentScenario = name;

    helpers.logError( message );
    helpers.asyncCall( callback );
};

/**
 *
 * @param event
 * @param callback
 */
var handleAfterScenario = function( event, callback ) {
    var scenario = event.getPayloadItem( 'scenario' );
    var translitedStr = translit( getTag( scenario ) + scenario.getName() );
    var name = helpers.modifyString( translitedStr );
    var message = helpers.replaceInOrder( consts.testFinished1, name );

    helpers.logError( message );
    helpers.asyncCall( callback );
};

/**
 *
 * @param item
 * @returns {*}
 */
var getTag = function( item ) {
    var tags = item.getTags();

    if( tags.length == 0 ) {
        return '';
    }

    return tags[ 0 ].getName() + ' ';
};

var teamCityFormatter = function() {
    this.registerHandler( 'BeforeFeature', handleBeforeFeature );
    this.registerHandler( 'AfterFeature', handleAfterFeature );
    this.registerHandler( 'BeforeScenario', handleBeforeScenario );
    this.registerHandler( 'AfterScenario', handleAfterScenario );
    this.registerHandler( 'StepResult', handleStepResult );
};

module.exports = teamCityFormatter;
