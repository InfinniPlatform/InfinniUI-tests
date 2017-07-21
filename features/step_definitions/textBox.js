'use strict';

var cucumber = require( 'cucumber' );
var helpers = require( '../../helpers/helpers' );
var insertText = function( input, text, i ) {
    if( text === '' || typeof text === 'undefined' || text === null ) {
        return input.sendKeys( '' );
    }

    var index = i || 0;
    return input.sendKeys( text[ index ] )
        .then( function() {
            return helpers.delay( 0 );
        } )
        .then( function() {
            if ( index < text.length -1 ) {
                index += 1;

                return insertText( input, text, index );
            }
        } );
};

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^я введу в текстовое поле "([^"]*)" значение "([^"]*)"$/, function( fieldName, value ) {
        value = value.replace( /''/g, '"' );
        fieldName = this.helpers.parseElement( fieldName );

        var that = this;
        var selector = this.selectors.XPATH.TextBox.caption( fieldName.name );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length <= fieldName.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                var input = elements[ fieldName.index ];

                // this is necessary because of inputs with masks
                return input.sendKeys( that.selectAll )
                    .then( function() {
                        return input.sendKeys( that.keys.BACK_SPACE );
                    } )
                    .then( function() {
                        return input.clear();
                    } )
                    .then( function() {
                        return input.sendKeys( that.selectAll );
                    } )
                    .then( function() {
                        return input.sendKeys( that.keys.DELETE );
                    } )
                    .then( function() {
                        return insertText( input, value );
                    } );
            } );
    } );

    When( /^значение в текстовом поле "([^"]*)" равно "([^"]*)"$/, function( textBoxLabel, value ) {
        textBoxLabel = this.helpers.parseElement( textBoxLabel );
        value = value.replace( /''/g, '"' );

        var selector = this.selectors.XPATH.TextBox.caption( textBoxLabel.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length <= textBoxLabel.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                return elements[ textBoxLabel.index ].getAttribute( 'value' );
            } )
            .then( function( actualValue ) {
                return that.assert.equal( actualValue, value );
            } );
    } );

} );
