/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractTableToolsTemplateComponent} from '../abstract-table-tools-template.component';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'tt-loading',
    templateUrl: './tt-loading.component.html'
})
export class TtLoadingComponent extends AbstractTableToolsTemplateComponent {
    @Input() extraCondition?: boolean;
}
