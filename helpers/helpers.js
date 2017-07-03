'use strict';

/**
 *
 * @param element
 * @returns {*}
 */
var parseElement = function( element ) {
    var expr = element.match( /([а-я]*[\s\S]*)\[(\d+)\]/i );

    if( !expr ) {
        return {
            name: element,
            index: 0
        };
    }

    return {
        name: expr[ 1 ].trim(),
        index: parseInt( expr[ 2 ] )
    };
};

/**
 *
 * @param date
 * @returns {*}
 */
var parseDate = function( date ) {
    var expr = date.match( /^\d{2}.\d{2}.\d{4}$/ );

    if( expr ) {
        return date;
    }

    expr = date.match( /Сегодня/ );

    if( expr ) {
        var currentDate = Date.now();
        expr = date.match( /([\+,\-])(\d+)/ );

        if( expr ) {
            var sign = expr[ 1 ];
            var iterator = expr[ 2 ];

            iterator = parseInt( iterator ) * 24 * 60 * 60 * 1000;
            currentDate = currentDate + ( sign == '+' ? iterator : iterator * -1 );
        }

        date = new Date( currentDate );

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        if( day < 10 ) {
            day = '0' + day;
        }

        if( month < 10 ) {
            month = '0' + month;
        }

        return day + '.' + month + '.' + year;
    }

    throw new Error( 'Некорректная дата' );
};

/**
 *
 * @param text
 * @returns {string}
 */
var fixQuotes = function( text ) {
    text = text.replace( /''/g, '"' );

    if( text.indexOf( '"' ) != -1 ) {
        return 'concat("' + text.replace( /"/g, '",\'"\',"' ) + '")';
    } else {
        return '"' + text + '"';
    }
};

/**
 *
 * @param text
 * @param textWithIgnore
 */
var ignoreNumbers = function( text, textWithIgnore ) {
    var numbers = text.match( /\d+/g );

    return format( textWithIgnore, numbers || [] );
};

/**
 *
 * @param text
 * @param textWithIgnore
 * @returns {*}
 */
var ignoreDates = function( text, textWithIgnore ) {
    var dates = text.match( /\d{2}.\d{2}.\d{4}/g );

    return format( textWithIgnore, dates || [] );
};

/**
 *
 * @param text
 * @param args
 * @returns {string|*}
 */
var format = function( text, args ) {
    return text.replace( /\{\{|\}\}|\{(\d+)\}/g, function( m, n ) {
        if( m == '{{' ) {
            return '{';
        }

        if( m == '}}' ) {
            return '}';
        }

        return args[ n ];
    } );
};


/**
 *
 * @param string
 * @returns {string}
 */
var modifyString = function( string ) {
    return string
        .replace( /\|/g, '||' )
        .replace( /\[/g, '|[' )
        .replace( /\]/g, '|]' )
        .replace( /\r/g, '|r' )
        .replace( /\n/g, '|n' )
        .replace( /'/g, '|' );
};

/**
 *
 * @param string
 * @returns {string}
 */
var replaceInOrder = function() {
    var args = Array.prototype.slice.call( arguments );
    var modifiedStr = args[ 0 ];

    for( var i = 1, ii = args.length; i < ii; i += 1 ) {
        modifiedStr = modifiedStr.replace( '%s', args[ i ] );
    }

    return modifiedStr;
};

/**
 *
 */
var fillStringAndWrite = function() {
    var message = replaceInOrder.apply( this, arguments );

    write( message );
};

/**
 *
 * @param func
 */
var asyncCall = function( func ) {
    setTimeout( function() {
        if( typeof func === 'function' ) {
            func();
        }
    }, 0 );
};

/**
 *
 * @param string
 * @returns {*}
 */
var escapeForTeamCity = function( string ) {
    if( !string ) {
        return string;
    }

    return modifyString( string );
};

/**
 *
 * @param message
 */
var write = function( message ) {
    message += '\n';
    fs.writeSync( 1, message );
    fs.fsyncSync( 1 );
};

/**
 *
 * @param message
 */
var logError = function( message ) {
    process.stderr.write( message );
};

/**
 *
 * @param message
 */
var log = function( message ) {
    process.stdout.write( message );
};

/**
 *
 * @param step
 */
var fixStepResult = function( step ) {
    step.isPending = function() {
        return this.status == 'pending';
    };
    step.isSkipped = function() {
        return this.status == 'skipped';
    };
    step.isUndefined = function() {
        return this.status == 'undefined';
    };
    step.isFailed = function() {
        return this.status == 'failed';
    };
    step.isSuccessful = function() {
        return this.status == 'successful';
    };
};

/**
 * @description create Promise delay for passed time
 * @param time
 * @returns {*}
 */
var delay = function( time ) {
    return new Promise( function( resolve, reject ) {
        setTimeout( resolve, time || 10 );
    } );
};

module.exports = {
    parseElement: parseElement,
    parseDate: parseDate,
    fixQuotes: fixQuotes,
    ignoreNumbers: ignoreNumbers,
    ignoreDates: ignoreDates,
    format: format,
    modifyString: modifyString,
    replaceInOrder: replaceInOrder,
    fillStringAndWrite: fillStringAndWrite,
    asyncCall: asyncCall,
    escapeForTeamCity: escapeForTeamCity,
    write: write,
    fixStepResult: fixStepResult,
    log: log,
    logError: logError,
    delay: delay
};
