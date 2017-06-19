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

var currentFeature;
var lastFailedTestName = null;
var cucumber = require( 'cucumber' );

cucumber.supportCodeLibrary( function( consumer ) {

    consumer.registerHandler( 'StepResult', function( stepResult, callback ) {
        var step = stepResult.step;
        var currentTime = getCurrentDate();
        var escapedTeamCity = helpers.escapeForTeamCity( step.name );

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

            var exception = stepResult.failureException;
            var stack = helpers.modifyString( exception.stack.toString() );

            helpers.fillStringAndWrite( consts.testFailed2, currentTime, stack, '', escapedTeamCity );
            helpers.fillStringAndWrite( consts.customProgressStatus1, currentTime );
        }

        helpers.fillStringAndWrite( consts.testFinished1, currentTime, currentTime, escapedTeamCity );
        helpers.asyncCall( callback );
    } );

    consumer.registerHandler( 'BeforeFeatures', function( features, callback ) {
        var currentTime = getCurrentDate();

        helpers.fillStringAndWrite( consts.enteredTheMatrix, currentTime );
        helpers.fillStringAndWrite( consts.customProgressStatus2, currentTime );
        helpers.asyncCall( callback );
    } );

    consumer.registerHandler( 'BeforeFeature', function( feature, callback ) {
        var currentTime = getCurrentDate();

        currentFeature = feature;

        helpers.fillStringAndWrite( consts.testSuiteStarted1, currentTime, feature.uri + ':' + feature.line, feature.name );
        helpers.asyncCall( callback );
    } );

    consumer.registerHandler( 'AfterFeature', function( feature, callback ) {
        var currentTime = getCurrentDate();

        helpers.fillStringAndWrite( consts.testSuiteFinished1, currentTime, feature.name );
        helpers.asyncCall( callback );
    } );

    consumer.registerHandler( 'BeforeStep', function( step, callback ) {
        var currentTime = getCurrentDate();
        var escapedTeamCity = helpers.escapeForTeamCity( step.name );

        helpers.fillStringAndWrite( consts.testStarted, currentTime, step.uri + ':' + step.line, escapedTeamCity );
        helpers.asyncCall( callback );
    } );

    consumer.registerHandler( 'BeforeScenario', function( scenario, callback ) {
        var currentTime = getCurrentDate();

        helpers.fillStringAndWrite( consts.customProgressStatus3, currentTime );
        helpers.fillStringAndWrite( consts.testSuiteStarted2, currentTime, scenario.uri + ':' + scenario.line, scenario.name );
        helpers.asyncCall( callback );
    } );

    consumer.registerHandler( 'AfterScenario', function( scenario, callback ) {
        var currentTime = getCurrentDate();

        helpers.fillStringAndWrite( consts.testSuiteFinished2, currentTime, scenario.name );
        helpers.asyncCall( callback );
    } );


    consumer.registerHandler( 'AfterFeatures', function( features, callback ) {
        var currentTime = getCurrentDate();

        helpers.fillStringAndWrite( consts.customProgressStatus4, currentTime );
        helpers.asyncCall( callback );
    } );

} );
