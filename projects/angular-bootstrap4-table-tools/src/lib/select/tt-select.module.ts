/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {NgModule} from '@angular/core';
import {TtSelectComponent} from './tt-select/tt-select.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TtSelectAllComponent} from './tt-select/tt-select-all.component';

@NgModule({
    imports: [
        ReactiveFormsModule
    ],
    declarations: [
        TtSelectAllComponent,
        TtSelectComponent
    ],
    exports: [
        TtSelectAllComponent,
        TtSelectComponent
    ]
})
export class TtSelectModule {

}
