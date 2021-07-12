/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Subject} from 'rxjs';

export class TtSelect<T extends object> {
    protected selected = new Map<T, boolean>();
    selectedChanges = new Subject<T[]>();

    getSelected(): T[] {
        return [...this.selected.keys()];
    }

    hasSelected(): boolean {
        return this.selected.size > 0;
    }

    select(...items: T[]): void {
        const nonSelected = items.filter((item) => !this.selected.has(item));

        if (!nonSelected.length) {
            return;
        }

        nonSelected.forEach((item) => {
            this.selected.set(item, true);
        });
        this.selectedChanges.next(this.getSelected());
    }

    deselect(...items: T[]): void {
        const selected = items.filter((item) => this.selected.has(item));

        if (!selected.length) {
            return;
        }

        selected.forEach((item) => {
            this.selected.delete(item);
        });
        this.selectedChanges.next(this.getSelected());
    }

    clear(): void {
        if (!this.hasSelected()) {
            return;
        }
        this.selected.clear();
        this.selectedChanges.next(this.getSelected());
    }
}
