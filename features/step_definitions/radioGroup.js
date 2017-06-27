'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^я выберу вариант "([^"]*)" в радиогруппе "([^"]*)"$/, function( variantText, radioGroupName ) {
        var radioGroup = this.helpers.parseElement( radioGroupName );
        var selector = this.selectors.XPATH.RadioGroup.item( radioGroup.name, variantText );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length <= radioGroup.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                return elements[ radioGroup.index ].click();
            } );
    } );

} );
