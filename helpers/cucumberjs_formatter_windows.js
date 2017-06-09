var fs = require( 'fs' );
var constants = require( './constants.json' );

var log = function( message ) {
    message += '\n';
    fs.writeSync( 1, message );
    fs.fsyncSync( 1 );
};

var fixStepResult = function( step ) {
    step.isPending = function() {
        return this.getStatus() == 'pending';
    };
    step.isSkipped = function() {
        return this.getStatus() == 'skipped';
    };
    step.isUndefined = function() {
        return this.getStatus() == 'undefined';
    };
    step.isFailed = function() {
        return this.getStatus() == 'failed';
    };
};

var adjustToLength = function( number, length ) {
    var result = '' + number;

    while( result.length < length ) {
        result = '0' + result;
    }
    return result;
};

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

var modifyString = function( string ) {
    return string
        .replace( /\|/g, '||' )
        .replace( /\[/g, '|[' )
        .replace( /\]/g, '|]' )
        .replace( /\r/g, '|r' )
        .replace( /\n/g, '|n' )
        .replace( /'/g, '|' );
};

var replaceInOrder = function( string ) {
    var args = Array.prototype.slice( arguments );
    var modifiedStr = string;

    for( var i = 1, ii = args.length; i < ii; i += 1 ) {
        modifiedStr = modifiedStr.replace( '%s', args[ i ] );
    }

    return modifiedStr;
};

var fillStringAndLog = function() {
    var message = replaceInOrder( arguments );

    log( message );
};

var asyncCall = function( func ) {
    setTimeout( function() {
        if( typeof func === 'function' ) {
            func();
        }
    }, 0 );
};

var escapeForTeamCity = function( string ) {
    if( !string ) {
        return string;
    }

    return modifyString( string );
};

var JetBrainsSMListener = function() {
    var currentFeature;
    var lastFailedTestName = null;
    var consts = constants.jetBrainsSMListener.stepResult;

    this.StepResult( function( event, callback ) {
        var stepResult = event.getPayloadItem( 'stepResult' );
        var step = stepResult.getStep();
        var currentTime = getCurrentDate();
        var escapedTeamCity = escapeForTeamCity( step.getName() );

        if( lastFailedTestName !== null && typeof lastFailedTestName !== 'undefined' && lastFailedTestName === escapedTeamCity ) {
            asyncCall( callback );
            return;
        }

        lastFailedTestName = null;
        fixStepResult( stepResult );

        if( stepResult.isPending() || stepResult.isSkipped() ) {
            fillStringAndLog( consts.testIgnored, escapedTeamCity, currentTime );
        } else if( stepResult.isUndefined() ) {
            fillStringAndLog( consts.testFailed1, currentTime, escapedTeamCity, escapedTeamCity );
        } else if( stepResult.isFailed() ) {
            lastFailedTestName = escapedTeamCity;

            var exception = stepResult.getFailureException();
            var stack = modifyString( exception.stack.toString() );

            fillStringAndLog( consts.testFailed2, currentTime, stack, '', escapedTeamCity );
            fillStringAndLog( consts.customProgressStatus1, currentTime );
        }

        fillStringAndLog( consts.testFinished, currentTime, currentTime, escapedTeamCity );
        asyncCall( callback );
    } );

    this.BeforeFeatures( function handleBeforeFeaturesEvent( event, callback ) {
        var currentTime = getCurrentDate();

        fillStringAndLog( consts.enteredTheMatrix, currentTime );
        fillStringAndLog( consts.customProgressStatus2, currentTime );
        asyncCall( callback );
    } );

    this.BeforeFeature( function( event, callback ) {
        var currentTime = getCurrentDate();
        var feature = event.getPayloadItem( 'feature' );
        currentFeature = feature;

        fillStringAndLog( consts.testSuiteStarted1, currentTime, feature.getUri() + ':' + feature.getLine(), feature.getName() );
        asyncCall( callback );
    } );

    this.AfterFeature( function handleAfterFeatureEvent( event, callback ) {
        var currentTime = getCurrentDate();
        var feature = event.getPayloadItem( 'feature' );

        fillStringAndLog( consts.testSuiteFinished1, currentTime, feature.getName() );
        asyncCall( callback );
    } );

    this.BeforeStep( function handleBeforeScenarioEvent( event, callback ) {
        var currentTime = getCurrentDate();
        var step = event.getPayloadItem( 'step' );
        var escapedTeamCity = escapeForTeamCity( step.getName() );

        fillStringAndLog( consts.testStarted, currentTime, step.getUri() + ':' + step.getLine(), escapedTeamCity );
        asyncCall( callback );
    } );

    this.BeforeScenario( function handleBeforeScenario( event, callback ) {
        var currentTime = getCurrentDate();
        var scenario = event.getPayloadItem( 'scenario' );

        fillStringAndLog( consts.customProgressStatus3, currentTime );
        fillStringAndLog( consts.testSuiteStarted2, currentTime, scenario.getUri() + ':' + scenario.getLine(), scenario.getName() );
        asyncCall( callback );
    } );

    this.AfterScenario( function handleAfterScenario( event, callback ) {
        var currentTime = getCurrentDate();
        var scenario = event.getPayloadItem( 'scenario' );

        fillStringAndLog( consts.testSuiteFinished2, currentTime, scenario.getName() );
        asyncCall( callback );
    } );


    this.AfterFeatures( function handleAfterFeaturesEvent( event, callback ) {
        var currentTime = getCurrentDate();

        fillStringAndLog( consts.customProgressStatus4, currentTime );
        asyncCall( callback );
    } );

};

module.exports = JetBrainsSMListener;
