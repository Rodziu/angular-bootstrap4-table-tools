/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {
    ContentChildren,
    Directive,
    ElementRef,
    Input,
    OnInit,
    QueryList
} from '@angular/core';
import {ITableTools} from './table-tools.service';
import {TtSelectComponent} from './select/tt-select/tt-select.component';

@Directive({
    selector: '[tableTools]',
})
export class TableToolsDirective implements OnInit {
    @Input() tableTools!: ITableTools<any>;
    @ContentChildren(TtSelectComponent, {descendants: true}) ttSelects!: QueryList<TtSelectComponent>;

    constructor(
        public elementRef: ElementRef<HTMLElement>
    ) {
    }

    ngOnInit(): void {
        this.tableTools.elementRef = this.elementRef;
    }
}
