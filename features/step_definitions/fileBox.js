'use strict';

var path = require( 'path' );
var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^в поле загрузки файла "([^"]*)" я прикреплю файл "([^"]*)"$/, function( fileBoxLabel, fileName ) {
        var parsedFileBoxLabel = this.helpers.parseElement( fileBoxLabel );
        var fileBoxSelector = this.selectors.XPATH.FileBox.caption( parsedFileBoxLabel.name );
        var fileBoxXpath = this.by.xpath( fileBoxSelector );
        var fileBoxInputSelector = this.selectors.XPATH.FileBox.inputField();
        var fileBoxInputXpath = this.by.xpath( fileBoxInputSelector );
        var pathToFolderWithFiles = this.config.filesToUploadFolder;

        return this.driver.findElements( fileBoxXpath )
            .then( function( fileBoxes ) {
                if( !fileBoxes.length ) {
                    throw new Error( 'Элемент не найден' );
                }

                return fileBoxes[ parsedFileBoxLabel.index ].findElement( fileBoxInputXpath );
            } )
            .then( function( fileBoxInput ) {
                if( !pathToFolderWithFiles ) {
                    throw new Error( 'В конфиге не указана папка откуда брать файлы для загрузки' );
                }

                return fileBoxInput.sendKeys( path.join( pathToFolderWithFiles, fileName ) );
            } );
    } );

    When( /^я удалю прикрепленный файл из поля "([^"]*)"$/, function( fileBoxName ) {
        fileBoxName = this.helpers.parseElement( fileBoxName );

        var selector = this.selectors.XPATH.FileBox.caption( fileBoxName.name );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.driver.findElements( xpath )
            .then( function( elements ) {
                if( !elements.length ) {
                    throw new Error( 'Элемент не найден' );
                }

                var selector = that.selectors.XPATH.FileBox.removeButton();
                var xpath = that.by.xpath( selector );

                return elements[ fileBoxName.index ].findElement( xpath );
            } )
            .then( function( button ) {
                return button.click();
            } );
    } );

} );
