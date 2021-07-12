/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Directive, Host, HostBinding, HostListener, Input, OnInit, SkipSelf} from '@angular/core';
import {TableToolsDirective} from '../table-tools.directive';
import {ITableTools} from '../table-tools.service';
import {IOrder} from '../table-tools-config.service';

@Directive({
    selector: '[ttSort]'
})
export class TtSortDirective implements OnInit {
    @Input() ttSort!: string;
    protected tableTools!: ITableTools<object>;
    protected state?: IOrder['direction'];

    @HostBinding('class.sorting-asc') get isAsc(): boolean {
        return this.state === 'asc';
    }

    @HostBinding('class.sorting-desc') get isDesc(): boolean {
        return this.state === 'desc';
    }

    @HostListener('click', ['$event.shiftKey']) click(shiftKey: boolean): void {
        const orderItem = this.getMyOrder(this.tableTools.order),
            newState = orderItem?.direction === 'asc' ? 'desc' : 'asc';
        if (!shiftKey) {
            this.tableTools.order = [{field: this.ttSort, direction: newState}];
        } else {
            if (!orderItem) {
                this.tableTools.order.push({field: this.ttSort, direction: newState});
            } else {
                orderItem.direction = orderItem.direction === 'asc' ? 'desc' : 'asc'
            }
            this.tableTools.order = [...this.tableTools.order];
        }
    }

    constructor(
        @SkipSelf() @Host() protected tableToolsDirective: TableToolsDirective
    ) {
    }

    ngOnInit(): void {
        this.tableTools = this.tableToolsDirective.tableTools;
        this.tableTools.orderChanges.subscribe((order) => {
            this.state = this.getMyOrder(order)?.direction;
        });
    }

    protected getMyOrder(order: IOrder[]): IOrder | undefined {
        return order
            .find((x) => x.field === this.ttSort);
    }
}
