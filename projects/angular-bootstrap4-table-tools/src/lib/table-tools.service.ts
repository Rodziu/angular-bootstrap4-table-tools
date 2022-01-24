/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {
    IOrder,
    IPerPageOption,
    TableToolsConfigService,
    TableToolsResolver
} from './table-tools-config.service';
import {ElementRef, Inject, Injectable} from '@angular/core';
import {TtPagination} from './pagination/tt-pagination';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {first, skip} from 'rxjs/operators';
import {TtSortService} from './sort/tt-sort.service';
import {FormControl} from '@angular/forms';
import {TtSearchService} from './search/tt-search.service';
import {TtFilterGroup} from './search/tt-filter-group';
import {TtSelect} from './select/tt-select';


export interface ITableToolsOptions<T extends object> {
    perPage: number;
    perPageOptions: IPerPageOption[];
    scroll: boolean;
    scrollOffset?: number;
    order: IOrder[];
    filters: TtFilterGroup;
    collection?: T[];
    url?: string;
    resolver?: TableToolsResolver<T>;
    asyncConfigurator?: (tableInstance: ITableTools<T>) => Observable<void>;
}

export interface ITableTools<T extends object> extends ITableToolsOptions<T> {
    loading: boolean;
    data: BehaviorSubject<T[]>;
    dataLength: number;
    filteredCount: number;
    searchControl: FormControl;
    perPageControl: FormControl;
    pagination: TtPagination;
    selected: TtSelect<T>;
    elementRef?: ElementRef<HTMLElement>;
    orderChanges: BehaviorSubject<IOrder[]>;

    filterData(): void;

    changePage(page: number | 'prev' | 'next'): void;
}

@Injectable({
    providedIn: 'root'
})
export class TableToolsService {
    constructor(
        private config: TableToolsConfigService,
        @Inject(DOCUMENT) private document: Document,
        private ttSort: TtSortService,
        private ttSearch: TtSearchService
    ) {
    }

    create<T extends object>(options: Partial<ITableToolsOptions<T>>): ITableTools<T> {
        return new TableTools<T>(options, this.config, this.document, this.ttSort, this.ttSearch);
    }
}

class TableTools<T extends object> implements ITableTools<T> {
    collection?: T[];
    resolver?: TableToolsResolver<T>;
    url?: string;

    loading = false;
    data = new BehaviorSubject<T[]>([]);

    dataLength = 0;
    filteredCount = 0;
    // region search
    searchControl = new FormControl();
    filters: TtFilterGroup;
    // endregion search
    // region pagination
    pagination: TtPagination;
    perPageControl: FormControl;

    get perPage(): number {
        return this.perPageControl.value;
    }

    set perPage(value) {
        if (this.perPageControl.value !== value) {
            this.perPageControl.setValue(value);
        }
    }

    perPageOptions: IPerPageOption[];
    scroll: boolean;
    scrollOffset: number;
    elementRef?: ElementRef<HTMLElement>; // set by directive, needed for scroll

    // endregion pagination
    // region order
    orderChanges: BehaviorSubject<IOrder[]>;

    get order(): IOrder[] {
        return this.orderChanges.getValue();
    }

    set order(order: IOrder[]) {
        this.orderChanges.next(order);
    }

    // endregion order
    // region select
    selected: TtSelect<T>;
    // endregion select

    private lastResolve: { subscription: Subscription | null, timeout: number | null } = {
        subscription: null,
        timeout: null
    };

    private configuring = false;

    constructor(
        options: Partial<ITableToolsOptions<T>>,
        config: TableToolsConfigService,
        private document: Document,
        private ttSort: TtSortService,
        private ttSearch: TtSearchService
    ) {
        this.searchControl.valueChanges.subscribe(() => {
            this.filterData();
        });
        this.filters = options.filters || new TtFilterGroup({});
        this.filters.valueChanges.subscribe(() => {
            this.filterData();
        });

        this.perPageControl = new FormControl(options.perPage || config.perPage);
        this.perPageOptions = options.perPageOptions || config.perPageOptions;
        this.perPageControl.valueChanges.subscribe(() => {
            this.filterData();
        })

        this.scroll = typeof options.scroll !== 'undefined' ? options.scroll : config.scroll;
        this.scrollOffset = typeof options.scrollOffset !== 'undefined' ? options.scrollOffset : 0;

        this.orderChanges = new BehaviorSubject<IOrder[]>(options.order || []);
        this.orderChanges
            .pipe(skip(1))
            .subscribe(() => {
                this.filterData();
            });

        this.selected = new TtSelect<T>();
        this.pagination = new TtPagination();

        this.collection = options.collection;

        if (typeof options.resolver !== 'undefined') {
            this.resolver = options.resolver;
        }

        if (typeof options.url !== 'undefined') {
            this.url = options.url;
            this.resolver = this.resolver || config.defaultTableToolsResolver;
        }

        if (typeof options.asyncConfigurator === 'function') {
            this.configuring = true;
        }

        setTimeout(() => {
            if (typeof options.asyncConfigurator === 'function') {
                options.asyncConfigurator(this)
                    .pipe(first())
                    .subscribe(() => {
                        this.configuring = false;
                        this.filterData();
                    });
            } else {
                this.filterData();
            }
        })
    }

    filterData(): void {
        if (this.configuring) {
            return;
        }

        if (typeof this.resolver !== 'undefined') {
            this.serverSide();
        } else {
            this.browserSide();
        }
    }

    changePage(page: number | 'prev' | 'next'): void {
        const originalPage = this.pagination.page;
        if (page === 'prev') {
            if (this.pagination.page > 1) {
                this.pagination.page--;
            }
        } else if (page === 'next') {
            if (this.pagination.page < this.pagination.pages) {
                this.pagination.page++;
            }
        } else if (!isNaN(page)) {
            this.pagination.page = page;
        }
        if (originalPage !== this.pagination.page) {
            this.filterData();
        }
        if (this.scroll) {
            this.scrollTo(
                Math.round(
                    (this.elementRef?.nativeElement.getBoundingClientRect().top || 0)
                    + (this.document.defaultView?.pageYOffset || this.document.documentElement.scrollTop)
                ) + this.scrollOffset,
                1000
            );
        }
    }

    private serverSide(): void {
        let timeout = 0;
        if (this.lastResolve.timeout !== null) {
            clearTimeout(this.lastResolve.timeout);
            if (this.lastResolve.subscription !== null) {
                this.lastResolve.subscription.unsubscribe();
            }
            timeout = 750;
        }

        this.lastResolve.timeout = setTimeout(() => {
            this.lastResolve.subscription = this.resolver!(
                this.perPage,
                (this.pagination.page - 1) * this.perPage,
                this.order,
                typeof this.searchControl.value !== 'string' ? '' : this.searchControl.value,
                this.ttSearch.getFieldFilters(this.filters),
                this.url
            ).subscribe((result) => {
                if (
                    typeof result.data === 'undefined'
                    || typeof result.count !== 'number'
                    || typeof result.countFiltered !== 'number'
                ) {
                    throw new Error('TableTools - wrong result format');
                }
                this.data.next(result.data);
                this.dataLength = result.count;
                this.filteredCount = result.countFiltered;
                if (this.pagination.page > 1 && !result.data.length) {
                    this.changePage(1);
                }
            }, (e) => {
                console.error(e);
                this.data.next([]);
                this.dataLength = 0;
                this.filteredCount = 0;
            }, () => {
                this.pagination.paginate(this.filteredCount, this.perPage);
                this.selected.clear();
                this.loading = false;
                this.lastResolve.timeout = null;
                this.lastResolve.subscription = null;
            });
        }, timeout);
    }

    private browserSide(): void {
        this.loading = true;
        let timeout = 0;
        if (this.lastResolve.timeout !== null) {
            clearTimeout(this.lastResolve.timeout);
            timeout = 50;
        }

        this.lastResolve.timeout = setTimeout(() => {
            this.dataLength = this.collection?.length || 0;
            let data = this.collection
                ? this.collection.filter(
                    this.ttSearch.getFilterFn(
                        this.searchControl.value?.toLowerCase(),
                        this.filters
                    )
                )
                : [];
            this.filteredCount = data.length;
            if (this.order.length) {
                data.sort(this.ttSort.getSortFn(this.order));
            }
            this.pagination.paginate(data.length, this.perPage);
            data = data.slice(this.pagination.start - 1, this.pagination.end);
            this.selected.clear();
            this.lastResolve.timeout = null;
            this.loading = false;
            this.data.next(data);
        }, timeout);
    }

    private scrollTo(target: number, duration: number): void {
        const cur = window.scrollY,
            start = performance.now(),
            step = (ts: number): void => {
                const elapsed = ts - start;
                if (elapsed >= 1000) {
                    this.document.defaultView?.scrollTo(0, target);
                    return;
                }
                this.document.defaultView?.scrollTo(
                    0,
                    cur - Math.sin((Math.PI / 2) / (duration / elapsed)) * (cur - target)
                );
                this.document.defaultView?.requestAnimationFrame(step);
            };
        this.document.defaultView?.requestAnimationFrame(step);
    }
}
