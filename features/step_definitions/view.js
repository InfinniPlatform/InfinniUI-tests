'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;
    var Then = consumer.Then;
    var Given = consumer.Given;

    Given( /^я нахожусь на экране "([^"]*)"$/, function( viewName ) {
        var that = this;
        var xpath = this.by.xpath( this.selectors.XPATH.View.self( viewName ) );

        return this.driver.findElement( xpath )
            .then( function( element ) {
                that.currentView = element;
            } );
    } );

    Then( /^система отобразит экран "([^"]*)"$/, function( viewName ) {
        var that = this;
        var xpath = this.by.xpath( this.selectors.XPATH.View.self( viewName ) );

        return this.driver.findElement( xpath )
            .then( function( element ) {
                that.currentView = element;
            } );
    } );

    Then( /^система отобразит модальное окно "([^"]*)"$/, function( viewName ) {
        var that = this;
        var xpath = this.by.xpath( this.selectors.XPATH.ModalView.header( viewName ) );

        return this.driver.findElement( xpath )
            .then( function( element ) {
                that.currentView = element;
            } );
    } );

    When( /^я закрою текущее модальное окно$/, function() {
        var selector = this.selectors.XPATH.ModalView.closeButton();
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.driver.findElements( xpath )
            .then( function( elements ) {
                var lastModalViewCloseButton = that._.last( elements );

                return lastModalViewCloseButton.click();
            } );
    } );

    Then( /^система отобразит окно-сообщение "([^"]*)"$/, function( message ) {
        var selector = this.selectors.XPATH.ModalView.message();
        var xpath = this.by.xpath( selector );
        var that = this;

        message = message.replace( /''/g, '"' );

        return this.driver.findElement( xpath )
            .then( function( messageBox ) {
                // delay for fadiIn animation of modal window
                return that.helpers.delay( 150 )
                    .then( function() {
                        return messageBox.getText();
                    } );
            } )
            .then( function( text ) {
                message = that.helpers.ignoreNumbers( text.trim(), message ).replace( /\\n/g, '\n' );

                if( text !== message ) {
                    throw new Error( 'text: "' + text + '" !== message: "' + message + '"' );
                }
            } );
    } );

    When( /^я нажму в окне-сообщении на кнопку "([^"]*)"$/, function( buttonText ) {
        var selector = this.selectors.XPATH.ModalView.messageBoxButton( buttonText );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.driver.findElement( xpath )
            .then( function( button ) {
                return button.click();
            } )
            .then( function() {
                return that.helpers.delay( 1000 );
            } );
    } );

} );
