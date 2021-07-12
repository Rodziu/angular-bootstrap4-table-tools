/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Injectable} from '@angular/core';
import {IOrder} from '../table-tools-config.service';
import {isNumeric} from 'rxjs/internal-compatibility';

@Injectable({
    providedIn: 'root'
})
export class TtSortService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    getSortFn<T extends { [s: string]: any }>(order: IOrder[]): (a: T, b: T) => number {
        return (a: T, b: T): number => {
            if (!order.length) {
                return 0;
            }
            let result = 0;
            order.some((orderItem) => {
                result = this.compareFn(a[orderItem.field], b[orderItem.field]);
                if (orderItem.direction === 'desc' && result !== 0) {
                    result = result === -1 ? 1 : -1;
                }
                return result !== 0;
            });
            return result;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    compareFn(a: any, b: any): number {
        const typeA = typeof a,
            typeB = typeof b;

        if (typeA !== typeB) {
            return typeA === 'undefined' ? 1
                : typeB === 'undefined' ? -1
                    : a === null ? 1
                        : b === null ? -1
                            : typeA < typeB ? -1 : 1;
        }

        if (typeof a === 'string' && typeof b === 'string') {
            if (this.isNumeric(a) && isNumeric(b)) {
                return parseFloat(a) < parseFloat(b) ? -1 : 1;
            }
            // Compare strings case-insensitively
            a = a.toLowerCase();
            b = b.toLowerCase();
        }

        if (a !== b) {
            if (typeof a.localeCompare === 'function') {
                return a.localeCompare(b);
            }

            return a < b ? -1 : 1;
        }

        return 0;
    }

    isNumeric(string: string): boolean {
        const n = parseFloat(string);
        return !isNaN(n) && isFinite(n);
    }
}
