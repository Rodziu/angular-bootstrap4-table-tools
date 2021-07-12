import { OnInit } from '@angular/core';
import { TableToolsDirective } from '../table-tools.directive';
import { ITableTools } from '../table-tools.service';
import { IOrder } from '../table-tools-config.service';
import * as i0 from "@angular/core";
export declare class TtSortDirective implements OnInit {
    protected tableToolsDirective: TableToolsDirective;
    ttSort: string;
    protected tableTools: ITableTools<object>;
    protected state?: IOrder['direction'];
    get isAsc(): boolean;
    get isDesc(): boolean;
    click(shiftKey: boolean): void;
    constructor(tableToolsDirective: TableToolsDirective);
    ngOnInit(): void;
    protected getMyOrder(order: IOrder[]): IOrder | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<TtSortDirective, [{ host: true; skipSelf: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TtSortDirective, "[ttSort]", never, { "ttSort": "ttSort"; }, {}, never>;
}
