/*
 * Angular TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    TableToolsService,
    ITableTools,
    TtFilterGroup,
    TtFilter, ITableToolsOptions, TableToolsConfigService,
} from 'angular-bootstrap4-table-tools';
import {FormControl} from '@angular/forms';
import {ITableToolsResponse} from '../../../angular-bootstrap4-table-tools/src/lib/table-tools-config.service';

interface IExample {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    ipAddress: string,
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    browserSideInstance: ITableTools<IExample>;
    genderMaleCheckbox = new FormControl();
    genderFemaleCheckbox = new FormControl();

    serverSideInstance: ITableTools<IExample>;
    genderMaleCheckboxServerSide = new FormControl();
    genderFemaleCheckboxServerSide = new FormControl();

    constructor(
        http: HttpClient,
        tableTools: TableToolsService,
        config: TableToolsConfigService
    ) {
        const tableToolsConfig: Partial<ITableToolsOptions<IExample>> = {
            perPage: 10,
            order: [{field: 'id', direction: 'asc'}],
            filters: new TtFilterGroup({
                firstName: new TtFilter(),
                lastName: new TtFilter(),
                idMore: new TtFilter({
                    field: 'id',
                    operator: '>'
                }),
                idLess: new TtFilter({
                    field: 'id',
                    operator: '<'
                }),
                genderMale: new TtFilter({
                    field: 'gender',
                    or: true
                }),
                genderFemale: new TtFilter({
                    field: 'gender',
                    or: true
                })
            })
        };

        this.browserSideInstance = tableTools.create(tableToolsConfig);

        this.genderMaleCheckbox.valueChanges.subscribe((checked) => {
            this.browserSideInstance.filters.get('genderMale')?.setValue(checked ? 'Male' : null);
        });
        this.genderFemaleCheckbox.valueChanges.subscribe((checked) => {
            this.browserSideInstance.filters.get('genderFemale')?.setValue(checked ? 'Female' : null);
        });

        http.get('assets/mock_data.json').subscribe((data) => {
            this.browserSideInstance.collection = data as unknown as IExample[];
            this.browserSideInstance.filterData();
        });
        this.browserSideInstance.selected.selectedChanges.subscribe((changes) => {
            console.log(changes);
        })

        // server side
        config.defaultTableToolsResolver = (
            limit,
            offset,
            order,
            search,
            filters,
            url
        ) => {
            return http.post<ITableToolsResponse<IExample>>(url || '', {
                limit: limit,
                offset: offset,
                order: order,
                search: search,
                filters: filters
            });
            // return new Observable((subscriber) => {
            //     subscriber.next();
            //     subscriber.complete();
            // });
        }

        const serverSideConfig: Partial<ITableToolsOptions<IExample>> = Object.assign({}, tableToolsConfig);
        serverSideConfig.url = 'assets/server-side.php';
        this.serverSideInstance = tableTools.create(serverSideConfig);

        this.genderMaleCheckboxServerSide.valueChanges.subscribe((checked) => {
            this.serverSideInstance.filters.get('genderMale')?.setValue(checked ? 'Male' : null);
        });
        this.genderFemaleCheckboxServerSide.valueChanges.subscribe((checked) => {
            this.serverSideInstance.filters.get('genderFemale')?.setValue(checked ? 'Female' : null);
        });
    }
}
