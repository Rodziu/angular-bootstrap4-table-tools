/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Component, Host, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TableToolsDirective} from '../../table-tools.directive';

@Component({
    selector: 'tt-select-all',
    templateUrl: './tt-select.component.html'
})
export class TtSelectAllComponent implements OnInit {
    formControl = new FormControl();

    constructor(
        @Host() private tableToolsDirective: TableToolsDirective
    ) {
    }

    ngOnInit(): void {
        this.formControl.valueChanges.subscribe((selected) => {
            if (selected) {
                this.tableToolsDirective.tableTools.selected.select(
                    ...this.tableToolsDirective.ttSelects.map((ttSelect) => ttSelect.item)
                );
            } else {
                this.tableToolsDirective.tableTools.selected.clear();
            }
        });

        this.tableToolsDirective.tableTools.selected.selectedChanges.subscribe((selected) => {
            const all = selected.length === this.tableToolsDirective.ttSelects.length;
            if (all !== !!this.formControl.value) {
                this.formControl.setValue(all);
            }
        });
    }
}
