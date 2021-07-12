/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {ITableToolsLang, TableToolsConfigService} from './table-tools-config.service';
import {ITableTools} from './table-tools.service';
import {TableToolsDirective} from './table-tools.directive';
import {Component, OnInit} from '@angular/core';

// eslint-disable-next-line @angular-eslint/use-component-selector
@Component({
    template: ''
})
export abstract class AbstractTableToolsTemplateComponent implements OnInit {
    lang: ITableToolsLang;
    tableTools!: ITableTools<object>;

    constructor(
        config: TableToolsConfigService,
        protected tableToolsDirective: TableToolsDirective
    ) {
        this.lang = config.lang;
    }

    ngOnInit(): void {
        this.tableTools = this.tableToolsDirective.tableTools;
    }
}
