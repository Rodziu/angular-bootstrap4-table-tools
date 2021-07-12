/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {operator} from '../table-tools-config.service';

export interface IFilterOptions {
    field?: string,
    empty: unknown,
    operator: operator,
    or: boolean
}

export class TtFilter extends FormControl {
    filterOptions: IFilterOptions;

    constructor(
        filterOptions?: Partial<IFilterOptions>,
        formState?: unknown,
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ) {
        super(formState, validatorOrOpts, asyncValidator);
        this.filterOptions = {
            empty: '',
            operator: '==',
            or: false
        };

        if (filterOptions) {
            this.filterOptions.field = filterOptions.field;
            if (typeof filterOptions.empty !== 'undefined') {
                this.filterOptions.empty = filterOptions.empty;
            }
            if (typeof filterOptions.operator !== 'undefined') {
                this.filterOptions.operator = filterOptions.operator;
            }
            if (typeof filterOptions.or !== 'undefined') {
                this.filterOptions.or = filterOptions.or;
            }
        }
    }
}
