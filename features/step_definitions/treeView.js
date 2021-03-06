'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^я раскрою\\закрою в дереве "([^"]*)" элемент "([^"]*)"$/, function( treeViewName, elementText ) {
        var selector = this.selectors.XPATH.TreeView.name( treeViewName );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElement( xpath )
            .then( function( treeView ) {
                selector = that.selectors.XPATH.TreeView.node( elementText );
                xpath = that.by.xpath( selector );

                return treeView.findElement( xpath );
            } )
            .then( function( node ) {
                selector = that.selectors.XPATH.TreeView.button();
                xpath = that.by.xpath( selector );

                return node.findElement( xpath );
            } )
            .then( function( button ) {
                return button.click();
            } );
    } );

    When( /^я нажму в дереве "([^"]*)" на элемент "([^"]*)"$/, function( treeViewName, elementText ) {
        var selector = this.selectors.XPATH.TreeView.name( treeViewName );
        var xpath = this.by.xpath( selector );
        var that = this;

        return this.currentView.findElement( xpath )
            .then( function( treeView ) {
                selector = that.selectors.XPATH.TreeView.node( elementText );
                xpath = that.by.xpath( selector );

                return treeView.findElement( xpath );
            } )
            .then( function( node ) {
                return node.click();
            } );
    } );

} );
