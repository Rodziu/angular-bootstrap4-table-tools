/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

export interface IPerPageOption {
    number: number,
    text: string
}

export interface ITableToolsLang {
    next: string;
    flipSelection: string;
    last: string;
    prev: string;
    csv: string;
    exportColumnNames: string;
    exportSeparator: string;
    exportChooseColumns: string;
    filteredResults: string;
    search: string;
    perPage: string;
    noResults: string;
    from: string;
    copiedToClipboard: string;
    copy: string;
    results: string;
    export: string;
    first: string;
    tabulator: string
}

export interface IOrder {
    field: string,
    direction: 'asc' | 'desc'
}

export type operator = '>' | '<' | '>=' | '<=' | '==' | 'like';

export interface IFilterInstance {
    operator: operator,
    value: unknown
}

export interface IFieldFilters {
    [fieldName: string]: {
        or: IFilterInstance[],
        and: IFilterInstance[]
    }
}

export type TableToolsResolver<T extends object> = (
    limit: number,
    offset: number,
    order: IOrder[],
    search: string,
    filters: IFieldFilters,
    url?: string
) => Observable<ITableToolsResponse<T>>;

export interface ITableToolsExportType {
    lang: string,
    parseText?: (txt: string) => string,
    callback: (data: unknown[][], config: {
        fileName: string,
        columnNames: boolean,
        separator: string
    }) => Observable<void>
}

export interface ITableToolsResponse<T extends object> {
    data: T[],
    count: number,
    countFiltered: number
}

@Injectable({
    providedIn: 'root'
})
export class TableToolsConfigService {
    constructor(
        @Inject(DOCUMENT) protected document: Document
    ) {
    }

    perPage = 25;
    perPageOptions: IPerPageOption[] = [
        {number: 10, text: '10'},
        {number: 25, text: '25'},
        {number: 50, text: '50'},
        {number: 100, text: '100'},
        {number: 200, text: '200'},
        {number: Infinity, text: 'Wszystkie'}
    ];

    lang: ITableToolsLang = {
        first: 'Pierwsza strona',
        prev: 'Poprzednia strona',
        next: 'Następna strona',
        last: 'Ostatnia strona',
        results: 'Wyniki:',
        from: 'z',
        perPage: 'Wyników na stronę:',
        search: 'Szukaj...',
        filteredResults: 'Filtrowanie z:',
        export: 'Export',
        exportChooseColumns: 'Wybierz kolumny',
        flipSelection: 'odwróć zaznaczenie',
        exportColumnNames: 'Eksportuj nazwy kolumn',
        exportSeparator: 'Separator',
        tabulator: 'Tabulator',
        copy: 'Kopiuj',
        csv: 'CSV',
        copiedToClipboard: 'Skopiowano do schowka',
        noResults: 'Nie znaleziono żadnych wyników!'
    };

    defaultTableToolsResolver?: TableToolsResolver<any>;

    scroll = true;
    scrollOffset = 0;

    exportTypes: { [name: string]: ITableToolsExportType } = {
        copy: {
            lang: this.lang.copy,
            callback: (data, config) => {
                return new Observable<void>((subscriber) => {
                    const copyCallback = (e: ClipboardEvent): void => {
                        // @ts-expect-error: window.clipboardData is available only in IE
                        const clipboard = e.clipboardData || this.document.defaultView.clipboardData;
                        clipboard.setData(
                            'text',
                            data
                                .map((row) => row.join(config.separator))
                                .join('\n')
                        );
                        e.preventDefault();
                        subscriber.next();
                        subscriber.complete();
                    }
                    this.document.addEventListener('copy', copyCallback)
                    this.document.execCommand('copy');
                    this.document.removeEventListener('copy', copyCallback);
                });
            }
        },
        csv: {
            lang: this.lang.csv,
            parseText(txt: string): string {
                return '"' + txt.replace('"', '""') + '"';
            },
            callback: (data, config) => {
                return new Observable<void>((subscriber) => {
                    const a = this.document.createElement('a'),
                        item = '\ufeff' + data.join('\n'),
                        blob = new Blob([item], {type: 'text/csv;utf-8'}),
                        url = URL.createObjectURL(blob);
                    a.setAttribute('style', 'display: none');
                    a.href = url;
                    a.download = config.fileName + '.csv';
                    this.document.body.appendChild(a);
                    a.click();
                    a.remove();
                    subscriber.next();
                    subscriber.complete();
                });
            }
        }
    };

    exportNotification(type: string): void {
        if (type === 'copy') {
            // eslint-disable-next-line no-alert
            alert(this.lang.copiedToClipboard);
        }
    }
}
