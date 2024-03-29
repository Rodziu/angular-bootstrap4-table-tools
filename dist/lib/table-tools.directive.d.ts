import { ElementRef, OnInit, QueryList, ViewContainerRef } from '@angular/core';
import { ITableTools } from './table-tools.service';
import { TtSelectComponent } from './select/tt-select/tt-select.component';
import * as i0 from "@angular/core";
export declare class TableToolsDirective implements OnInit {
    elementRef: ElementRef<HTMLElement>;
    private viewContainerRef;
    tableTools: ITableTools<any>;
    ttSelects: QueryList<TtSelectComponent>;
    constructor(elementRef: ElementRef<HTMLElement>, viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TableToolsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TableToolsDirective, "[tableTools]", never, { "tableTools": "tableTools"; }, {}, ["ttSelects"]>;
}
