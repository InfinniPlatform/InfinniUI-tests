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
var handleStepResult = function( stepResult, callback ) {
    helpers.fixStepResult( stepResult );

    if( !stepResult.isSuccessful() && !stepResult.isPending() &&
        !stepResult.isSkipped() && !stepResult.isUndefined() ) {

        var failMessage = stepResult.failureException;

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
var handleBeforeFeature = function( feature, callback ) {
    var translitedStr = translit( getTag( feature ) + feature.name );
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
var handleAfterFeature = function( featureResult, callback ) {
    var translitedStr = translit( getTag( featureResult ) + featureResult.name );
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
var handleBeforeScenario = function( scenario, callback ) {
    var translitedStr = translit( getTag( scenario ) + scenario.name );
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
var handleAfterScenario = function( scenarioResult, callback ) {
    var translitedStr = translit( getTag( scenarioResult ) + scenarioResult.name );
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
    var tags = item.tags;

    if( tags.length == 0 ) {
        return '';
    }

    return tags[ 0 ].name + ' ';
};
var cucumber = require( 'cucumber' );

module.exports = function() {
    cucumber.defineSupportCode( function( consumer ) {

        consumer.registerHandler( 'BeforeFeature', handleBeforeFeature );
        consumer.registerHandler( 'AfterFeature', handleAfterFeature );
        consumer.registerHandler( 'BeforeScenario', handleBeforeScenario );
        consumer.registerHandler( 'AfterScenario', handleAfterScenario );
        consumer.registerHandler( 'StepResult', handleStepResult );

    } );
};
