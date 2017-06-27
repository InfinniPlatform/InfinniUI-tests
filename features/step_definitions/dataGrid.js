'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^я увижу в таблице "([^"]*)" строку под номером "([^"]*)" со значением "([^"]*)"$/, function( dataGridName, rowIndex, values ) {
        var selector = this.selectors.XPATH.DataGrid.body( dataGridName );
        var xpath = this.by.xpath( selector );
        var that = this;

        rowIndex = parseInt( rowIndex );
        values = values.split( '|' );
        values.splice( 0, 1 );
        values.splice( values.length - 1, 1 );

        this.assert.isNumber( rowIndex );

        return this.currentView.findElement( xpath )
            .then( function( dataGrid ) {
                selector = that.selectors.XPATH.DataGrid.rows();
                xpath = that.by.xpath( selector );

                return dataGrid.findElements( xpath );
            } )
            .then( function( rows ) {
                selector = that.selectors.XPATH.DataGrid.cells();
                xpath = that.by.xpath( selector );

                if( rows.length < rowIndex + 1 ) {
                    throw new Error( 'Требуется ' + ( rowIndex + 1 ) + ' строка, всего строк - ' + rows.length );
                }

                return rows[ rowIndex ].findElements( xpath );
            } )
            .then( function( cells ) {
                return cellChecker( cells, 0 );

                function cellChecker( cells, index ) {
                    var cell = cells[ index ];
                    var expected = values[ index ].replace( /''/g, '"' );

                    return cell.getText()
                        .then( function( text ) {
                            text = text.trim();

                            if( expected !== '***' && text !== expected ) {
                                throw new Error( 'Expected: ' + expected + ' !== text: ' + text );
                            }

                            index += 1;

                            if( index < cells.length ) {
                                return cellChecker( cells, index );
                            }
                        } );
                }
            } );
    } );

    When( /^я отмечу в таблице "([^"]*)" строку под номером "([^"]*)"$/, function( dataGridName, rowIndex ) {
        var selector = this.selectors.XPATH.DataGrid.body( dataGridName );
        var xpath = this.by.xpath( selector );
        var that = this;

        rowIndex = parseInt( rowIndex );

        this.assert.isNumber( rowIndex );

        return this.currentView.findElement( xpath )
            .then( function( dataGrid ) {
                selector = that.selectors.XPATH.DataGrid.rows();
                xpath = that.by.xpath( selector );

                return dataGrid.findElements( xpath );
            } )
            .then( function( rows ) {
                selector = that.selectors.XPATH.DataGrid.toggle();
                xpath = that.by.xpath( selector );

                if( rows.length < rowIndex + 1 ) {
                    throw new Error( 'Требуется ' + ( rowIndex + 1 ) + ' строка, всего строк - ' + rows.length );
                }

                return rows[ rowIndex ].findElement( xpath );
            } )
            .then( function( toggleCell ) {
                return toggleCell.click();
            } );
    } );

    When( /^я нажму в заголовке таблицы "([^"]*)" на ячейку под номером "([^"]*)"$/, function( tableName, cellIndex ) {
        var selector = this.selectors.XPATH.DataGrid.headerCells( tableName );
        var xpath = this.by.xpath( selector );

        cellIndex = parseInt( cellIndex );

        return this.currentView.findElements( xpath )
            .then( function( cells ) {
                if( cells.length <= cellIndex ) {
                    throw new Error( 'Ячейка не найдена' );
                }

                return cells[ cellIndex ].click();
            } );
    } );

    When( /^я увижу пустую таблицу "([^"]*)"$/, function( tableName ) {
        var selector = this.selectors.XPATH.DataGrid.body( tableName );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElement( xpath )
            .then( function( table ) {
                selector = that.selectors.XPATH.DataGrid.rows();
                xpath = that.by.xpath( selector );

                return table.findElements( xpath );
            } )
            .then( function( rows ) {
                that.assert.equal( rows.length, 0 );
            } );
    } );

} );
