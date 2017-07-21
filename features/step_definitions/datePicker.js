'use strict';

var cucumber = require( 'cucumber' );
var helpers = require( '../../helpers/helpers' );
var insertDate = function( input, date, i ) {
    var index = i || 0;
    return input.sendKeys( date[ index ] )
        .then( function() {
            return helpers.delay( 0 );
        } )
        .then( function() {
            if ( index < date.length -1 ) {
                index += 1;

                return insertDate( input, date, index );
            }
        } );
};

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^я введу в поле типа дата "([^"]*)" значение "([^"]*)"$/, function( pickerText, date ) {
        var picker = this.helpers.parseElement( pickerText );

        var selector = this.selectors.XPATH.DatePicker.caption( picker.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        date = this.helpers.parseDate( date ).split( '.' );

        return this.currentView.findElements( xpath )
            .then( function( labels ) {
                if( labels.length <= picker.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                return labels[ picker.index ].getAttribute( 'for' );
            } )
            .then( function( id ) {
                return that.currentView.findElement( that.by.id( id ) );
            } )
            .then( function( input ) {
                // this is necessary because of inputs with masks
                return input.sendKeys( that.selectAll )
                    .then( function() {
                        return input.sendKeys( that.keys.BACK_SPACE );
                    } )
                    .then( function() {
                        return input.sendKeys( that.selectAll );
                    } )
                    .then( function() {
                        return input.sendKeys( that.keys.DELETE );
                    } )
                    .then( function() {
                        return insertDate( input, date.join( '' ) );
                    } );
            } );
    } );

    When( /^значение в поле типа дата "([^"]*)" равно "([^"]*)"$/, function( pickerText, date ) {
        var picker = this.helpers.parseElement( pickerText );

        var selector = this.selectors.XPATH.DatePicker.caption( picker.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        date = this.helpers.parseDate( date );

        return this.currentView.findElements( xpath )
            .then( function( labels ) {
                if( labels.length <= picker.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                return labels[ picker.index ].getAttribute( 'for' );
            } )
            .then( function( id ) {
                return that.currentView.findElement( that.by.id( id ) );
            } )
            .then( function( input ) {
                return input.getAttribute( 'value' );
            } )
            .then( function( value ) {
                return that.assert.equal( value, date );
            } );
    } );

    When( /^я очищу поле типа дата "([^"]*)"$/, function( pickerText ) {
        var picker = this.helpers.parseElement( pickerText );

        var selector = this.selectors.XPATH.DatePicker.caption( picker.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( labels ) {
                if( labels.length <= picker.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                return labels[ picker.index ].getAttribute( 'for' );
            } )
            .then( function( id ) {
                return that.currentView.findElement( that.by.id( id ) );
            } )
            .then( function( input ) {
                return input.sendKeys( that.selectAll )
                    .then( function() {
                        return input.sendKeys( that.keys.BACK_SPACE );
                    } )
                    .then( function() {
                        return input.sendKeys( that.selectAll );
                    } )
                    .then( function() {
                        return input.sendKeys( that.keys.DELETE );
                    } );
            } );
    } );

} );
