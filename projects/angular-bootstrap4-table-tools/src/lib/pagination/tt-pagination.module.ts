/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {NgModule} from '@angular/core';
import {TtResultsCountComponent} from './tt-results-count/tt-results-count.component';
import {CommonModule} from '@angular/common';
import {TtPaginationComponent} from './tt-pagination/tt-pagination.component';
import {TtPerPageComponent} from './tt-per-page/tt-per-page.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        TtPaginationComponent,
        TtPerPageComponent,
        TtResultsCountComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        TtPaginationComponent,
        TtPerPageComponent,
        TtResultsCountComponent
    ]
})
export class TtPaginationModule {
}
