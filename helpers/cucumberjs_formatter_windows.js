var fs = require( 'fs' );
var helpers = require( './helpers' );
var consts = require( './constants.json' ).cucumberjsFormatter.stepResult;

/**
 *
 * @param number
 * @param length
 * @returns {string}
 */
var adjustToLength = function( number, length ) {
    var result = '' + number;

    while( result.length < length ) {
        result = '0' + result;
    }
    return result;
};

/**
 *
 * @returns {string}
 */
var getCurrentDate = function() {
    var date = new Date();
    var year = adjustToLength( date.getFullYear(), 4 );
    var month = adjustToLength( date.getMonth(), 2 );
    var day = adjustToLength( date.getDay(), 2 );

    var hours = adjustToLength( date.getHours(), 2 );
    var minutes = adjustToLength( date.getMinutes(), 2 );
    var seconds = adjustToLength( date.getSeconds(), 2 );
    var milliseconds = adjustToLength( date.getMilliseconds(), 3 );

    var timezone = Math.abs( date.getTimezoneOffset() / 60 * ( -1 ) );

    timezone = adjustToLength( timezone, 2 );

    if( date.getTimezoneOffset() > 0 ) {
        timezone = '-' + timezone;
    } else {
        timezone = '+' + timezone;
    }

    return '' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + '' + timezone + '00';
};

var JetBrainsSMListener = function() {
    var currentFeature;
    var lastFailedTestName = null;

    this.StepResult( function( event, callback ) {
        var stepResult = event.getPayloadItem( 'stepResult' );
        var step = stepResult.getStep();
        var currentTime = getCurrentDate();
        var escapedTeamCity = helpers.escapeForTeamCity( step.getName() );

        if( lastFailedTestName !== null && typeof lastFailedTestName !== 'undefined' && lastFailedTestName === escapedTeamCity ) {
            asyncCall( callback );
            return;
        }

        lastFailedTestName = null;
        helpers.fixStepResult( stepResult );

        if( stepResult.isPending() || stepResult.isSkipped() ) {
            helpers.fillStringAndWrite( consts.testIgnored, escapedTeamCity, currentTime );
        } else if( stepResult.isUndefined() ) {
            helpers.fillStringAndWrite( consts.testFailed1, currentTime, escapedTeamCity, escapedTeamCity );
        } else if( stepResult.isFailed() ) {
            lastFailedTestName = escapedTeamCity;

            var exception = stepResult.getFailureException();
            var stack = helpers.modifyString( exception.stack.toString() );

            helpers.fillStringAndWrite( consts.testFailed2, currentTime, stack, '', escapedTeamCity );
            helpers.fillStringAndWrite( consts.customProgressStatus1, currentTime );
        }

        helpers.fillStringAndWrite( consts.testFinished1, currentTime, currentTime, escapedTeamCity );
        helpers.asyncCall( callback );
    } );

    this.BeforeFeatures( function handleBeforeFeaturesEvent( event, callback ) {
        var currentTime = getCurrentDate();

        helpers.fillStringAndWrite( consts.enteredTheMatrix, currentTime );
        helpers.fillStringAndWrite( consts.customProgressStatus2, currentTime );
        helpers.asyncCall( callback );
    } );

    this.BeforeFeature( function( event, callback ) {
        var currentTime = getCurrentDate();
        var feature = event.getPayloadItem( 'feature' );

        currentFeature = feature;

        helpers.fillStringAndWrite( consts.testSuiteStarted1, currentTime, feature.getUri() + ':' + feature.getLine(), feature.getName() );
        helpers.asyncCall( callback );
    } );

    this.AfterFeature( function handleAfterFeatureEvent( event, callback ) {
        var currentTime = getCurrentDate();
        var feature = event.getPayloadItem( 'feature' );

        helpers.fillStringAndWrite( consts.testSuiteFinished1, currentTime, feature.getName() );
        helpers.asyncCall( callback );
    } );

    this.BeforeStep( function handleBeforeScenarioEvent( event, callback ) {
        var currentTime = getCurrentDate();
        var step = event.getPayloadItem( 'step' );
        var escapedTeamCity = helpers.escapeForTeamCity( step.getName() );

        helpers.fillStringAndWrite( consts.testStarted, currentTime, step.getUri() + ':' + step.getLine(), escapedTeamCity );
        helpers.asyncCall( callback );
    } );

    this.BeforeScenario( function handleBeforeScenario( event, callback ) {
        var currentTime = getCurrentDate();
        var scenario = event.getPayloadItem( 'scenario' );

        helpers.fillStringAndWrite( consts.customProgressStatus3, currentTime );
        helpers.fillStringAndWrite( consts.testSuiteStarted2, currentTime, scenario.getUri() + ':' + scenario.getLine(), scenario.getName() );
        helpers.asyncCall( callback );
    } );

    this.AfterScenario( function handleAfterScenario( event, callback ) {
        var currentTime = getCurrentDate();
        var scenario = event.getPayloadItem( 'scenario' );

        helpers.fillStringAndWrite( consts.testSuiteFinished2, currentTime, scenario.getName() );
        helpers.asyncCall( callback );
    } );


    this.AfterFeatures( function handleAfterFeaturesEvent( event, callback ) {
        var currentTime = getCurrentDate();

        helpers.fillStringAndWrite( consts.customProgressStatus4, currentTime );
        helpers.asyncCall( callback );
    } );

};

module.exports = JetBrainsSMListener;
