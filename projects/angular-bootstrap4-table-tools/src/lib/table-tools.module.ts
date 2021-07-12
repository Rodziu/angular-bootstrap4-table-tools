/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {NgModule} from '@angular/core';
import {TableToolsDirective} from './table-tools.directive';
import {TtPaginationModule} from './pagination/tt-pagination.module';
import {TtHeaderComponent} from './tt-header/tt-header.component';
import {TtFooterComponent} from './tt-footer/tt-footer.component';
import {TtRowPlaceholderComponent} from './tt-row-placeholder/tt-row-placeholder.component';
import {CommonModule} from '@angular/common';
import {TtLoadingComponent} from './tt-loading/tt-loading.component';
import {TtSortModule} from './sort/tt-sort.module';
import {TtSearchModule} from './search/tt-search.module';
import {TtSelectModule} from './select/tt-select.module';
import {TtExportModule} from './export/tt-export.module';

@NgModule({
    imports: [
        CommonModule,
        TtExportModule,
        TtPaginationModule,
        TtSearchModule,
        TtSelectModule,
        TtSortModule
    ],
    declarations: [
        TableToolsDirective,
        TtFooterComponent,
        TtHeaderComponent,
        TtLoadingComponent,
        TtRowPlaceholderComponent
    ],
    exports: [
        TableToolsDirective,
        TtExportModule,
        TtFooterComponent,
        TtHeaderComponent,
        TtLoadingComponent,
        TtPaginationModule,
        TtRowPlaceholderComponent,
        TtSearchModule,
        TtSelectModule,
        TtSortModule
    ]
})
export class TableToolsModule {

}
