/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Component, Inject} from '@angular/core';
import {AbstractTableToolsTemplateComponent} from '../../abstract-table-tools-template.component';
import {ITableToolsExportType, TableToolsConfigService} from '../../table-tools-config.service';
import {TableToolsDirective} from '../../table-tools.directive';
import {DOCUMENT} from '@angular/common';

let id = 0;

@Component({
    selector: 'tt-export',
    templateUrl: './tt-export.component.html'
})
export class TtExportComponent extends AbstractTableToolsTemplateComponent {
    id = ++id;
    modal = false;
    columns: { txt: string, idx: number, checked: boolean }[] = [];
    exportConfig: { fileName: string, columnNames: boolean, separator: string } = {
        separator: ',',
        fileName: '',
        columnNames: true
    };
    separators: { lang: string; separator: string }[] = [];
    exporting: string | boolean = false;
    exportTypes: TableToolsConfigService['exportTypes'];

    constructor(
        protected config: TableToolsConfigService,
        protected tableToolsDirective: TableToolsDirective,
        @Inject(DOCUMENT) protected document: Document
    ) {
        super(config, tableToolsDirective);

        this.separators = [
            {lang: ',', separator: ','},
            {lang: ';', separator: ';'},
            {lang: this.lang.tabulator, separator: '\t'}
        ];

        this.exportTypes = config.exportTypes;
    }


    showExport(): void {
        const headers = this.tableToolsDirective.elementRef.nativeElement
            .querySelectorAll('table > thead > tr:last-child > th');
        this.columns = [];
        headers.forEach((h, idx) => {
            if (!h.classList.contains('ignore-export')) {
                this.columns.push({
                    txt: h.innerHTML,
                    idx,
                    checked: true
                });
            }
        });
        this.exportConfig.fileName = this.document.title;
        this.modal = true;
    }

    flipSelection(): void {
        this.columns.forEach((column) => {
            column.checked = !column.checked;
        });
    }

    doExport(type: string, config: ITableToolsExportType): void {
        this.exporting = type;
        const indexes: number[] = [],
            data: unknown[][] = [],
            parseText = (text: string): string => {
                if (typeof config.parseText === 'function') {
                    text = config.parseText(text);
                }
                return text;
            },
            appendRow = () => {
                if (row.length) {
                    data.push(row);
                    row = [];
                }
            };
        let row: unknown[] = [];
        // get columns to export
        this.columns.forEach((column) => {
            if (column.checked) {
                indexes.push(column.idx);
                if (this.exportConfig.columnNames) {
                    row.push(parseText(column.txt));
                }
            }
        });
        appendRow();
        // grab data
        const columns = this.tableToolsDirective.elementRef.nativeElement
            .querySelectorAll<HTMLTableCellElement>('table > tbody > tr:not(.ignore-export) > td');
        let rowId = -1;
        columns.forEach((cell) => {
            if (indexes.includes(cell.cellIndex)) {
                if ((cell.parentElement as HTMLTableRowElement).rowIndex !== rowId) {
                    rowId = (cell.parentElement as HTMLTableRowElement).rowIndex;
                    appendRow();
                }
                row.push(parseText(cell.textContent?.trim() || ''));
            }
        })
        appendRow();
        // export
        config.callback(data, this.exportConfig).subscribe(() => {
            this.exporting = false;
            this.modal = false;

            if (typeof this.config.exportNotification === 'function') {
                this.config.exportNotification(type);
            }
        });
    }
}
