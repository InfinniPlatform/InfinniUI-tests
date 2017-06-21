'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {

    consumer.When( /^я удалю прикрепленный файл из поля "([^"]*)"$/, function( fileBoxName ) {
        fileBoxName = this.helpers.parseElement( fileBoxName );

        var selector = this.selectors.XPATH.FileBox.caption( fileBoxName.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( element ) {
                if( element.length <= fileBoxName.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                var selector = that.selectors.XPATH.FileBox.removeButton();
                var xpath = that.by.xpath( selector );

                return element[ fileBoxName.index ].findElement( xpath );
            } )
            .then( function( button ) {
                return button.click();
            } );
    } );

} );
