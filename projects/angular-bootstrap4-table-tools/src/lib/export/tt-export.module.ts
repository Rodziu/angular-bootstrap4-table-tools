/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {NgModule} from '@angular/core';
import {TtExportComponent} from './tt-export/tt-export.component';
import {BsModalModule} from 'angular-bootstrap4';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        TtExportComponent
    ],
    imports: [
        BsModalModule,
        CommonModule,
        FormsModule
    ],
    exports: [
        TtExportComponent
    ]
})
export class TtExportModule {

}
