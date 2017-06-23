'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {

    consumer.When( /^значение в числовом поле "([^"]*)" равно "([^"]*)"$/, function( fieldLabel, value ) {
        fieldLabel = this.helpers.parseElement( fieldLabel );

        var selector = this.selectors.XPATH.NumericBox.caption( fieldLabel.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( labels ) {
                return labels[ fieldLabel.index ].getAttribute( 'for' );
            } )
            .then( function( id ) {
                return that.currentView.findElement( that.by.id( id ) );
            } )
            .then( function( input ) {
                return input.getAttribute( 'value' );
            } )
            .then( function( inputValue ) {
                return that.assert.equal( inputValue, value );
            } );
    } );

    consumer.When( /^я введу в числовое поле "([^"]*)" значение "([^"]*)"$/, function( fieldLabel, value ) {
        fieldLabel = this.helpers.parseElement( fieldLabel );

        var selector = this.selectors.XPATH.NumericBox.caption( fieldLabel.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( labels ) {
                return labels[ fieldLabel.index ].getAttribute( 'for' );
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
                        return input.clear();
                    } )
                    .then( function() {
                        return input.sendKeys( that.selectAll );
                    } )
                    .then( function() {
                        return input.sendKeys( that.keys.DELETE );
                    } )
                    .then( function() {
                        return input.sendKeys( value );
                    } );
            } );
    } );

    consumer.When( /^я увеличу значение в числовом поле "([^"]*)"$/, function( fieldLabel ) {
        fieldLabel = this.helpers.parseElement( fieldLabel );

        var selector = this.selectors.XPATH.NumericBox.maxButton( fieldLabel.name );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElements( xpath )
            .then( function( maxButtons ) {
                return maxButtons[ fieldLabel.index ].click();
            } );
    } );

    consumer.When( /^я уменьшу значение в числовом поле "([^"]*)"$/, function( fieldLabel ) {
        fieldLabel = this.helpers.parseElement( fieldLabel );

        var selector = this.selectors.XPATH.NumericBox.minButton( fieldLabel.name );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElements( xpath )
            .then( function( minButtons ) {
                return minButtons[ fieldLabel.index ].click();
            } );
    } );

} );
