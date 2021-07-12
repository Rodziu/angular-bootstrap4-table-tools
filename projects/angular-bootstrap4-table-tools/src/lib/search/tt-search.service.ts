/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Injectable} from '@angular/core';
import {TtFilterGroup} from './tt-filter-group';
import {TtFilter} from './tt-filter';
import {IFieldFilters, IFilterInstance, operator} from '../table-tools-config.service';

@Injectable({
    providedIn: 'root'
})
export class TtSearchService {
    getFilterFn<T>(
        search?: string,
        filters?: TtFilterGroup
    ): (value: T, index: number, array: T[]) => boolean {
        const hasSearch = typeof search === 'string' && search !== '',
            fieldFilters = this.getFieldFilters(filters),
            hasFilters = Object.keys(fieldFilters).length;

        return (value: T): boolean => {
            if (!hasSearch && !hasFilters) {
                return true;
            }

            return (!hasSearch || this.hasSearchString(value, search as string))
                && (!hasFilters || typeof value !== 'object' || value === null
                    || this.areFiltersValid(value as Record<string, unknown>, fieldFilters));
        }
    }

    private hasSearchString(variable: unknown, search: string): boolean {
        if (typeof variable === 'object' && variable !== null) {
            return !!Object.keys(variable as object).find((key) => {
                return this.hasSearchString((variable as Record<string, unknown>)[key], search);
            });
        } else if (
            (typeof variable === 'number' && variable.toString() === search)
            || (typeof variable === 'string' && variable.toLowerCase().includes(search))
        ) {
            return true;
        }
        return false;
    }

    getFieldFilters(filters?: TtFilterGroup): IFieldFilters {
        if (typeof filters === 'undefined') {
            return {};
        }

        const fieldFilters: IFieldFilters = {};

        Object.entries(filters.controls as Record<string, TtFilter>)
            .filter(([, filter]) => {
                return typeof filter.value !== 'undefined'
                    && filter.value !== null
                    && filter.value !== filter.filterOptions.empty
                    && !(Array.isArray(filter.value) && !filter.value.length);
            })
            .forEach(([field, filter]) => {
                if (!filter.filterOptions.field) {
                    filter.filterOptions.field = field;
                }

                const fieldName = filter.filterOptions.field || field;

                if (typeof fieldFilters[fieldName] === 'undefined') {
                    fieldFilters[fieldName] = {
                        or: [],
                        and: []
                    };
                }

                const filterVal = {operator: filter.filterOptions.operator, value: filter.value};

                if (filter.filterOptions.or) {
                    fieldFilters[fieldName].or.push(filterVal);
                } else {
                    fieldFilters[fieldName].and.push(filterVal);
                }
            });

        return fieldFilters;
    }

    private areFiltersValid(item: Record<string, unknown>, fieldFilters: IFieldFilters): boolean {
        return Object.entries(fieldFilters)
            .every(([field, filters]) => {
                const compareFn = this.getCompareFn(item[field]);

                return (!filters.or.length || filters.or.some(compareFn)) // [].some() = false
                    && filters.and.every(compareFn); // [].every() = true
            })
    }

    private getCompareFn(
        value: unknown
    ): (filter: IFilterInstance, index: number, array: IFilterInstance[]) => boolean {
        return (filter): boolean => {
            return this.compareWithOperator(value, filter.value, filter.operator);
        }
    }

    private compareWithOperator(
        variable: unknown,
        search: unknown,
        operator: operator
    ): boolean {
        if (typeof search === 'object') {
            return !!Object.values(search as Record<string, unknown>)
                .find((value) => this.compareWithOperator(variable, value, operator));
        }
        if (typeof variable === 'object') {
            return !!Object.keys(variable as Record<string, unknown>)
                .find((key) => this.compareWithOperator((variable as Record<string, unknown>)[key], search, operator));
        }
        if (operator === 'like') {
            return (variable as string).toLowerCase().includes((search as string).toLowerCase());
        } else {
            switch (operator) {
                case '>':
                    // @ts-expect-error: unknown comparison
                    return variable > search;
                case '<':
                    // @ts-expect-error: unknown comparison
                    return variable < search;
                case '>=':
                    // @ts-expect-error: unknown comparison
                    return variable >= search;
                case '<=':
                    // @ts-expect-error: unknown comparison
                    return variable <= search;
                case '==':
                    // eslint-disable-next-line eqeqeq
                    return variable == search;
                default:
                    return true;
            }
        }
    }
}
