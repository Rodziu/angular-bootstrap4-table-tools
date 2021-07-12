/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn} from '@angular/forms';
import {TtFilter} from './tt-filter';

export class TtFilterGroup extends FormGroup {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(
        filters: {
            [key: string]: TtFilter;
        },
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ) {
        super(filters, validatorOrOpts, asyncValidator);
    }
}
