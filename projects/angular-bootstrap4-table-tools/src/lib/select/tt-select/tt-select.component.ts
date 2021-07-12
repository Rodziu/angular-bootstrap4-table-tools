/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Component, Host, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TableToolsDirective} from '../../table-tools.directive';

@Component({
    selector: 'tt-select',
    templateUrl: './tt-select.component.html'
})
export class TtSelectComponent implements OnInit {
    @Input() item!: object;

    formControl = new FormControl();

    constructor(
        @Host() private tableToolsDirective: TableToolsDirective
    ) {
    }

    ngOnInit(): void {
        this.formControl.valueChanges.subscribe((selected) => {
            if (selected) {
                this.tableToolsDirective.tableTools.selected.select(this.item);
            } else {
                this.tableToolsDirective.tableTools.selected.deselect(this.item);
            }
        });

        this.tableToolsDirective.tableTools.selected.selectedChanges.subscribe((selected) => {
            this.formControl.setValue(selected.includes(this.item));
        });
    }
}
