'use strict';

var cucumber = require( 'cucumber' );

cucumber.defineSupportCode( function( consumer ) {
    var When = consumer.When;

    When( /^я выберу вкладку "([^"]*)" на панели "([^"]*)"$/, function( tabPageLabel, panelName ) {
        var selector = this.selectors.XPATH.TabPanel.page( panelName, tabPageLabel );
        var xpath = this.by.xpath( selector );

        return this.currentView.findElement( xpath )
            .then( function( button ) {
                return button.click();
            } );
    } );

} );
