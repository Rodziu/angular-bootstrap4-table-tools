/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {NgModule} from '@angular/core';
import {TtSearchComponent} from './tt-search/tt-search.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        TtSearchComponent
    ],
    imports: [
        ReactiveFormsModule
    ],
    exports: [
        TtSearchComponent
    ]
})
export class TtSearchModule {
}
