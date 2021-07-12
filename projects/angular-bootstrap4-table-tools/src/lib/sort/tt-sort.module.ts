/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {NgModule} from '@angular/core';
import {TtSortDirective} from './tt-sort.directive';

@NgModule({
    declarations: [
        TtSortDirective
    ],
    exports: [
        TtSortDirective
    ]
})
export class TtSortModule {
}
