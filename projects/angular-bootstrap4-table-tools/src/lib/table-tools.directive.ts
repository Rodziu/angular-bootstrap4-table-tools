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
    QueryList, ViewContainerRef
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
        public elementRef: ElementRef<HTMLElement>,
        private viewContainerRef: ViewContainerRef
    ) {
    }

    ngOnInit(): void {
        if (this.elementRef.nativeElement.nodeType === Node.COMMENT_NODE) {
            this.tableTools.elementRef = new ElementRef<HTMLElement>(
                this.viewContainerRef.element.nativeElement.previousElementSibling
            );
        } else {
            this.tableTools.elementRef = this.elementRef;
        }
    }
}
