'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {

    consumer.When( /^я введу в поле типа дата "([^"]*)" значение "([^"]*)"$/, function( pickerText, date ) {
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
                var arr = [ that.selectAll, that.keys.BACK_SPACE ];

                date.forEach( function( number ) {
                    arr.push( number );
                } );

                return input.sendKeys.apply( input, arr );
            } );
    } );

    consumer.When( /^значение в поле типа дата "([^"]*)" равно "([^"]*)"$/, function( pickerText, date ) {
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
                that.assert.equal( value, date );
            } );
    } );

    consumer.When( /^я очищу поле типа дата "([^"]*)"$/, function( pickerText ) {
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
                return input.sendKeys( that.selectAll, that.keys.BACK_SPACE );
            } );
    } );

} );
