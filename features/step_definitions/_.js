'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;
    var Then = consumer.Then;

    Then( /^система отобразит список валидационных сообщений: (.*?)$/, function( messages ) {
        var selector = this.selectors.XPATH.Toastr.messages();
        var xpath = this.by.xpath( selector );
        var that = this;

        messages = this._.map( messages.split( '", ' ), function( item ) {
            return item
                .replace( /"/g, '' )
                .replace( /''/g, '"' );
        } );

        return this.driver.findElements( xpath )
            .then( function( msgs ) {
                that.assert.equal( msgs.length, messages.length, 'Количество сообщений не совпадает' );

                return msgChecker( msgs, 0 );

                function msgChecker( msgs, index ) {
                    var msg = msgs[ index ];

                    return msg.getText()
                        .then( function( text ) {
                            messages[ index ] = that.helpers.ignoreDates( text.trim(), messages[ index ] );

                            var linesActual = text.split( '\n' );
                            var linesExpected = messages[ index ].split( '\\n' );
                            var diff = that._.difference( linesActual, linesExpected );

                            if( !that._.isArray( diff ) ) {
                                diff = [ diff ];
                            }

                            that.assert.deepEqual( linesActual, linesExpected, 'Не совпали:\n' + diff.join( '\n' ) + '\n' );

                            index += 1;

                            if( index < msgs.length ) {
                                return msgChecker( msgs, index );
                            } else {
                                that.driver.executeScript( '$("#toast-container").remove();' );
                            }
                        } );
                }
            } );
    } );

    Then( /^система не отобразит валидационных сообщений$/, function() {
        var selector = this.selectors.XPATH.Toastr.messages();
        var xpath = this.by.xpath( selector );
        var driver = this.driver;

        return driver.findElements( xpath )
            .then( function( msgs ) {
                if( msgs.length !== 0 ) {
                    var message = 'Найдено ' + msgs.length + ' сообщений\n';
                    var buildFullMessage = function( msgs, i ) {
                        var msg = msgs[ i ];

                        return msg.getText()
                            .then( function( text ) {
                                message += ( ( i + 1 ) + '. ' + text + ';\n' );

                                if( i === msgs.length - 1 ) {
                                    throw new Error( message );
                                } else {
                                    i += 1;
                                    return buildFullMessage( msgs, i );
                                }
                            } );
                    };

                    return buildFullMessage( msgs, 0 );
                }
            } );
    } );

    When( /^я увижу элемент "([^"]*)"$/, function( elementName ) {
        elementName = this.helpers.parseElement( elementName );

        var selector = this.selectors.XPATH.Element.byName( elementName.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length < elementName.index + 1 ) {
                    throw new Error( 'Элемент не найден' );
                }

                return elements[ elementName.index ].isDisplayed();
            } )
            .then( function( value ) {
                return that.assert.equal( value, true );
            } );
    } );

    When( /^я не увижу элемент "([^"]*)"$/, function( elementName ) {
        elementName = this.helpers.parseElement( elementName );

        var selector = this.selectors.XPATH.Element.byName( elementName.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length < elementName.index + 1 ) {
                    throw new Error( 'Элемент не найден' );
                }

                return elements[ elementName.index ].isDisplayed();
            } )
            .then( function( value ) {
                return that.assert.equal( value, false );
            } );
    } );

    When( /^я нажму на клавишу "([^"]*)"$/, function( key ) {
        var keys = this._.map( key.split( '+' ), function( k ) {
            return this.keys[ k.trim().toUpperCase() ];
        }.bind( this ) );

        return this.driver.switchTo().activeElement()
            .then( function( element ) {
                return element.sendKeys.apply( element, keys );
            } );
    } );

    When( /^я увижу элемент "([^"]*)" с текстом "([^"]*)"$/, function( elementName, text ) {
        elementName = this.helpers.parseElement( elementName );
        text = text.replace( /''/g, '"' );

        var selector = this.selectors.XPATH.Element.byName( elementName.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length < elementName.index + 1 ) {
                    throw new Error( 'Элемент не найден' );
                }

                return elements[ elementName.index ].getText();
            } )
            .then( function( elementText ) {
                elementText = elementText.replace( /\n/g, '\\n' );

                return that.assert.equal( elementText, text );
            } );
    } );

    When( /^элемент "([^"]*)" будет недоступным$/, function( elementName ) {
        elementName = this.helpers.parseElement( elementName );

        var selector = this.selectors.XPATH.Element.byName( elementName.name );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length <= elementName.index ) {
                    throw new Error( 'Элемент не найден' );
                }

                return elements[ elementName.index ].getAttribute( 'class' );
            } )
            .then( function( classes ) {
                if( classes.indexOf( 'pl-disabled' ) === -1 ) {
                    throw new Error( 'Элемент доступен' );
                }
            } );
    } );

    When( /^я нажму на элемент "([^"]*)"$/, function( elementName ) {
        elementName = this.helpers.parseElement( elementName );

        var selector = this.selectors.XPATH.Element.byName( elementName.name );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElements( xpath )
            .then( function( elements ) {
                if( elements.length <= elementName.index ) {
                    throw new Error( 'Элемент не найден' );
                }
                return elements[ elementName.index ].click();
            } );
    } );

    When( /^выполнится задержка на "([^"]*)" секунд$/, function( time ) {
        return this.helpers.delay( parseInt( time, 10 ) * 1000 );
    } );

} );
