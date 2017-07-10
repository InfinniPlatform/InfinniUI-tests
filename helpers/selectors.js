'use strict';

module.exports = {

    XPATH: {

        TextBox: {

            /**
             *
             * @param name
             * @returns {string}
             */
            textBoxByName: function( name ) {
                return './/div[contains(@class, "pl-textbox") and @data-pl-name = "' + name + '"]/*[self::input or self::textarea]';
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            passwordBoxByName: function( name ) {
                return './/div[contains(@class, "pl-password-box") and @data-pl-name = "' + name + '"]/*[self::input or self::textarea]';
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            byName: function( name ) {
                return this.textBoxByName( name ) + '|' + this.passwordBoxByName( name );
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            byLabelText: function( text ) {
                return './/div[contains(@class, "pl-textbox") or contains(@class, "pl-password-box")]/label[contains(@class, "pl-control-label") and normalize-space(node()) = "' + text + '"]/../*[self::input or self::textarea]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            caption: function( text ) {
                return this.byLabelText( text ) + '|' + this.byName( text );
            }

        },

        Button: {

            /**
             *
             * @returns {string}
             */
            self: function() {
                return this.default() + '|' + this.link();
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            caption: function( text ) {
                return this.self()
                    .replace( /\{caption\}/g, 'normalize-space(node()) = ' + text )
                    .replace( /\{pl-name\}/g, '@data-pl-name=' + text );
            },

            /**
             *
             * @returns {string}
             */
            default_text: function() {
                return './/div[contains(@class, "pl-button")]/button[{caption}]';
            },

            /**
             *
             * @returns {string}
             */
            default_name: function() {
                return './/div[contains(@class, "pl-button") and {pl-name}]/button';
            },

            /**
             *
             * @returns {string}
             */
            default: function() {
                return this.default_text() + '|' + this.default_name();
            },

            /**
             *
             * @returns {string}
             */
            link_text: function() {
                return './/a[contains(@class, "pl-button") and {caption}]';
            },

            /**
             *
             * @returns {string}
             */
            link_name: function() {
                return './/a[contains(@class, "pl-button") and {pl-name}]';
            },

            /**
             *
             * @returns {string}
             */
            link: function() {
                return this.link_text() + '|' + this.link_name();
            },

            /**
             *
             * @param text
             * @returns {[*,*,*,*]}
             */
            popupCaptions: function( text ) {
                return [
                    /* By text (link) */
                    './/a[contains(@class, "pl-popup-button")]/span[contains(@class, "pl-popup-button__button") and normalize-space(node()) = "' + text + '"]',
                    /* By text (button) */
                    './/div[contains(@class, "pl-popup-button")]//button[contains(@class, "pl-popup-button__button") and normalize-space(node()) = "' + text + '"]',
                    /* By name (link) */
                    './/a[contains(@class, "pl-popup-button") and @data-pl-name="' + text + '"]',
                    /* By name (button) */
                    './/div[contains(@class, "pl-popup-button") and @data-pl-name="' + text + '"]'
                ];
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            popupCaption: function( text ) {
                return this.popupCaptions( text ).join( '|' );
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            popupItem: function( text ) {
                return '//div[contains(@class, "pl-popup-button__dropdown")]//a[contains(@class, "pl-button") and normalize-space(node()) = "' + text + '"]';
            }

        },

        ModalView: {

            /**
             *
             * @returns {string}
             */
            self: function() {
                return './/h4[@class="modal-title"]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            header: function( text ) {
                return this.self() + '/span[contains(@class, "pl-label") and normalize-space(node()) = "' + text + '"]/../../..';
            },

            /**
             *
             * @returns {string}
             */
            message: function() {
                return '//div[@class="modal-dialog"]//p[@class="pl-messagebox-content"]';
            },

            /**
             *
             * @returns {string}
             */
            closeButton: function() {
                return './/div[contains(@class, "modal-dialog")]//div[@class="modal-header"]/button[contains(@class, "pl-close-modal")]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            messageBoxButton: function( text ) {
                return '//div[@class="modal-dialog"]//a[contains(@class, "pl-messagebox-button") and normalize-space(node()) = "' + text + '"]';
            }

        },

        DatePicker: {

            /**
             *
             * @returns {string}
             */
            self: function() {
                return './/div[contains(@class, "pl-datepicker")]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            caption: function( text ) {
                return this.self() + '/label[contains(@class, "pl-control-label") and normalize-space(node()) = "' + text + '"]';
            }

        },

        ComboBox: {

            /**
             *
             * @param text
             * @returns {string}
             */
            caption: function( text ) {
                return ( this.byName( text ) + '{label}' + '|' + this.byLabelText( text ) + '{label}' ).replace( /\{label}/g, '/label[@class = "pl-control-label"]' );
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            byName: function( name ) {
                return './/div[contains(@class, "pl-combobox") and @data-pl-name = ' + name + ']';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            byLabelText: function( text ) {
                return './/div[contains(@class, "pl-combobox")]/label[contains(@class, "pl-control-label") and normalize-space(node()) = ' + text + ']/..';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            button: function( text ) {
                return ( this.byName( text ) + '{button}' + '|' + this.byLabelText( text ) + '{button}' ).replace( /\{button}/g, '//span[contains(@class, "pl-combobox__grip")]' );
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            dropDown: function( text ) {
                return '//div[contains(@class, "pl-dropdown-container")]//div[contains(@class, "pl-combobox-items")]/*[normalize-space(.) = ' + text + ']';
            },

            /**
             *
             * @returns {string}
             */
            filter: function() {
                return '//div[contains(@class, "pl-dropdown-container")]//input[contains(@class, "pl-combobox-filter-text")]';
            },

            /**
             *
             * @returns {string}
             */
            value: function() {
                return './/span[contains(@class, "pl-label")]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            clear: function( text ) {
                return this.caption( text ) + '/..//span[contains(@class, "pl-combobox__clear")]';
            }

        },

        DataGrid: {

            /**
             *
             * @param name
             * @returns {string}
             */
            self: function( name ) {
                return './/div[contains(@class, "pl-datagrid") and @data-pl-name="' + name + '"]';
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            body: function( name ) {
                return this.self( name ) + '/div[contains(@class, "pl-datagrid__body")]';
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            head: function( name ) {
                return this.self( name ) + '/div[contains(@class, "pl-datagrid__head")]//tr[contains(@class, "pl-datagrid-row_header")]';
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            headerCells: function( name ) {
                return this.head( name ) + '/th[contains(@class, "pl-datagrid-row__cell")]';
            },

            /**
             *
             * @returns {string}
             */
            rows: function() {
                return './/tr[contains(@class, "pl-datagrid-row_data")]';
            },

            /**
             *
             * @returns {string}
             */
            cells: function() {
                return './/td[@class="pl-datagrid-row__cell"]';
            },

            /**
             *
             * @returns {string}
             */
            toggle: function() {
                return './/td[contains(@class, "pl-datagrid-row__cell_toggle")]';
            }

        },

        Toastr: {

            /**
             *
             * @returns {string}
             */
            container: function() {
                return '//div[@id="toast-container"]';
            },

            /**
             *
             * @returns {string}
             */
            messages: function() {
                return this.container() + '/div[contains(@class, "toast-success") or contains(@class, "toast-error")]/div[@class="toast-message"]';
            }

        },

        View: {

            /**
             *
             * @param name
             * @returns {string}
             */
            self: function( name ) {
                return '//div[contains(@class, "pl-view") and @data-pl-name="' + name + '"]';
            }

        },

        Panel: {

            /**
             *
             * @returns {string}
             */
            self: function() {
                return './/div[contains(@class, "pl-panel")]';
            },

            /**
             *
             * @returns {string}
             */
            header: function() {
                return '/div[contains(@class, "pl-panel-header")]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            caption: function( text ) {
                return this.self() + this.header() + '/span[contains(@class, "pl-label") and normalize-space(node()) = "' + text + '"]';
            }

        },

        NumericBox: {

            /**
             *
             * @returns {string}
             */
            self: function() {
                return './/div[contains(@class, "pl-numericbox")]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            caption: function( text ) {
                return this.self() + '/label[@class="pl-control-label" and normalize-space(node()) = "' + text + '"]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            minButton: function( text ) {
                return this.caption( text ) + '/..//span[contains(@class, "pl-numeric-box-min")]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            maxButton: function( text ) {
                return this.caption( text ) + '/..//span[contains(@class, "pl-numeric-box-max")]';
            }

        },

        TabPanel: {

            /**
             *
             * @param name
             * @returns {string}
             */
            self: function( name ) {
                return './/div[contains(@class, "pl-tabpanel") and @data-pl-name="' + name + '"]';
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            list: function( name ) {
                return this.self( name ) + '//ul[contains(@class, "pl-tabpanel-header")]';
            },

            /**
             *
             * @param name
             * @param text
             * @returns {string}
             */
            page: function( name, text ) {
                return this.list( name ) + '/li[@class="pl-tabheader" and normalize-space(node()) = "' + text + '"]';
            }

        },

        CheckBox: {

            /**
             *
             * @param name
             * @returns {string}
             */
            name: function( name ) {
                return './/div[@data-pl-name="' + name + '"]//input';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            label: function( text ) {
                return './/div[@class="checkbox"]//span[@class="checkbox-label" and normalize-space(node()) = "' + text + '"]/../input';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            self: function( text ) {
                return this.name( text ) + '|' + this.label( text );
            }

        },

        Element: {

            /**
             *
             * @param name
             * @returns {string}
             */
            byName: function( name ) {
                var result = [];
                var that = this;

                this.tags.forEach( function( tag ) {
                    result.push( that.element( tag, name ) );
                } );

                return result.join( '|' );
            },

            /**
             *
             * @param tag
             * @param name
             * @returns {string}
             */
            element: function( tag, name ) {
                return './/' + tag + '[@data-pl-name="' + name + '"]';
            },

            tags: [ 'div', 'a', 'i', 'p', 'span', 'ul', 'li' ]

        },

        RadioGroup: {

            /**
             *
             * @param name
             * @returns {string}
             */
            name: function( name ) {
                return './/div[contains(@class, "pl-listbox") and @data-pl-name="' + name + '"]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            text: function( text ) {
                return '/ul[@class="pl-listbox-control"]//div[contains(@class, "pl-listbox-body") and normalize-space(node()) = "' + text + '"]';
            },

            /**
             *
             * @param name
             * @param text
             * @returns {*}
             */
            item: function( name, text ) {
                return this.name( name ) + this.text( text );
            }

        },

        FileBox: {

            /**
             *
             * @param text
             * @returns {string}
             */
            caption: function( text ) {
                return this.byName( text ) + '|' + this.byLabelText( text );
            },

            /**
             *
             * @param name
             * @returns {string}
             */
            byName: function( name ) {
                return './/div[contains(@class, "pl-file-box") and @data-pl-name = "' + name + '"]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            byLabelText: function( text ) {
                return './/div[contains(@class, "pl-file-box")]//label[@class = "pl-control-label" and normalize-space(node()) = "' + text + '"]/../..';
            },

            /**
             *
             * @returns {string}
             */
            removeButton: function() {
                return './/button[contains(@class, "pl-filebox-btn-remove")]';
            }

        },

        TreeView: {

            /**
             *
             * @param name
             * @returns {string}
             */
            name: function( name ) {
                return './/div[contains(@class, "pl-treeview") and @data-pl-name="' + name + '"]';
            },

            /**
             *
             * @param text
             * @returns {string}
             */
            node: function( text ) {
                // Относительно name()
                return './/div[contains(@class, "pl-treeview-node")]' +
                    '/div[contains(@class, "pl-treeview-node__item")]' +
                    '/div[contains(@class, "pl-treeview-item__content") and normalize-space(node()) = "' + text + '"]';
            },

            /**
             *
             * @returns {string}
             */
            button: function() {
                // Относительно node()
                return './../../span[contains(@class, "pl-treeview-node__button")]';
            }

        },

        UIBlocker: {

            name: function() {
                return '//div[contains(@class, "blockUI")]';
            }

        }

    }

};
