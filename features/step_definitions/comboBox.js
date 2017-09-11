'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^я выберу в выпадающем списке "([^"]*)" значение "([^"]*)"$/, function( comboBoxLabel, value ) {
        comboBoxLabel = this.helpers.parseElement( comboBoxLabel );
        comboBoxLabel.name = this.helpers.fixQuotes( comboBoxLabel.name );
        value = this.helpers.fixQuotes( value );

        var buttonSelector = this.selectors.XPATH.ComboBox.button( comboBoxLabel.name );
        var buttonXpath = this.by.xpath( buttonSelector );
        var dropdownSelector = this.selectors.XPATH.ComboBox.dropDown( value );
        var dropdownXpath = this.by.xpath( dropdownSelector );
        var that = this;

        return this.currentView.findElements( buttonXpath )
            .then( function( elements ) {
                return elements[ comboBoxLabel.index ].click();
            } )
            .then( function() {
                return that.driver.findElement( dropdownXpath );
            } )
            .then( function( dropdownItem ) {
                return dropdownItem.click();
            } )
            .then( function() {
                return that.driver.findElements( dropdownXpath );
            } )
            .then( function( dropdownItems ) {
                if( dropdownItems.length ) {
                    return dropdownItems[ 0 ].click();
                }
            } );
    } );

    When( /^я выберу в выпадающем списке "([^"]*)" с фильтром "([^"]*)" значение "([^"]*)"$/, function( comboBoxLabel, filter, value ) {
        comboBoxLabel = this.helpers.parseElement( comboBoxLabel );
        comboBoxLabel.name = this.helpers.fixQuotes( comboBoxLabel.name );
        value = this.helpers.fixQuotes( value );

        var buttonSelector = this.selectors.XPATH.ComboBox.button( comboBoxLabel.name );
        var buttonXpath = this.by.xpath( buttonSelector );
        var filterSelector = this.selectors.XPATH.ComboBox.filter();
        var filterXpath = this.by.xpath( filterSelector );
        var dropdownSelector = this.selectors.XPATH.ComboBox.dropDown( value );
        var dropdownXpath = this.by.xpath( dropdownSelector );
        var blocker = this.by.xpath( this.selectors.XPATH.UIBlocker.name() );
        var that = this;

        return this.currentView.findElements( buttonXpath )
            .then( function( elements ) {
                return elements[ comboBoxLabel.index ].click();
            } )
            .then( function() {
                return that.driver.findElement( filterXpath );
            } )
            .then( function( filteredField ) {
                return filteredField.sendKeys( filter );
            } )
            .then( function() {
                var divider = 2;
                var totalAttempts = 60 * divider;
                var secondTime = false;

                return new Promise( function( resolve, reject ) {
                    tryContinue( 0, resolve, reject );
                } );

                function tryContinue( i, resolve, reject ) {
                    that.driver.findElements( blocker )
                        .then( function( elements ) {
                            if( !elements.length && secondTime ) {
                                resolve();
                            } else {
                                secondTime = true;
                                if( i < totalAttempts ) {
                                    setTimeout( function() {
                                        tryContinue( i + 1, resolve, reject );
                                    }, 1000 / divider );
                                } else {
                                    reject( 'Блокирование страницы индикатором загрузки более чем на ' + totalAttempts / divider + ' сек.' );
                                }
                            }
                        } );
                }
            } )
            .then( function() {
                return that.driver.findElement( dropdownXpath );
            } )
            .then( function( dropDownItem ) {
                return dropDownItem.click();
            } )
            .then( function() {

                return that.driver.findElements( dropdownXpath );
            } )
            .then( function( dropDownItems ) {
                if( dropDownItems.length ) {
                    return dropDownItems[ 0 ].click();
                }
            } );
    } );

    When( /^значение в выпадающем списке "([^"]*)" равно "([^"]*)"$/, function( comboBoxLabel, value ) {
        comboBoxLabel = this.helpers.parseElement( comboBoxLabel );
        comboBoxLabel.name = this.helpers.fixQuotes( comboBoxLabel.name );
        value = value.replace( /''/g, '"' );

        var selector = this.selectors.XPATH.ComboBox.caption( comboBoxLabel.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( labels ) {
                return labels[ comboBoxLabel.index ].getAttribute( 'for' );
            } )
            .then( function( id ) {
                return that.currentView.findElement( that.by.id( id ) );
            } )
            .then( function( control ) {
                selector = that.selectors.XPATH.ComboBox.value();
                xpath = that.by.xpath( selector );

                return control.findElement( xpath );
            } )
            .then( function( comboBoxValue ) {
                return comboBoxValue.getText();
            } )
            .then( function( text ) {
                return that.assert.equal( text, value );
            } );
    } );

    When( /^я очищу выпадающий список "([^"]*)"$/, function( comboBoxLabel ) {
        comboBoxLabel = this.helpers.parseElement( comboBoxLabel );
        comboBoxLabel.name = this.helpers.fixQuotes( comboBoxLabel.name );

        var selector = this.selectors.XPATH.ComboBox.clear( comboBoxLabel.name );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElements( xpath )
            .then( function( buttons ) {
                if( buttons[ comboBoxLabel.index ] ) {
                    return buttons[ comboBoxLabel.index ].click();
                }

                throw new Error( 'Элемент не найден' );
            } );
    } );

} );
