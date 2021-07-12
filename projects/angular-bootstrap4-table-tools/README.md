# Angular TableTools Plugin

Plugin that makes working with tables easier.
Through various set of directives it enables you to easily create a pagination, sort table data, filter it and many more.

It uses [Bootstrap 4](https://getbootstrap.com/docs/) and [Font Awesome](https://fontawesome.com/v5.15/icons/) for better presentation.

See [Live Demo](https://mateuszrohde.pl/repository/angular-bootstrap4-table-tools/demo/index.html) for an example.

## Prerequisites

- Angular,
- [angular-bootstrap-4](https://mateuszrohde.pl/repository/angular-bootstrap-4),
- Font Awesome.

## Installation

```
yarn add angular-bootstrap4-table-tools
yarn install
```

## Configuration

Language strings and other defaults are configurable through the `TableToolsConfig` service.

```
class AppComponent {
	constructor(config: TableToolsConfigService) {
		config.perPage = 10;
	}
}
```

## Usage

See [Live Demo](https://mateuszrohde.pl/repository/angular-bootstrap4-table-tools/demo/index.html) and its source code to better understand all of available components and its usage.

### Basic usage

Create an tableTools instance via `TableToolsService.create(config)` method. Table data should be an array of objects. 

This instance needs to be bound to your table container via `[tableTools]` directive.

Filtered data is available via `instance.data` property which is an `Observable`.

```typescript
tableToolsInstance: ITableTools<T>; // pass your row type as generic argument

this.tableToolsInstance = tableToolsService.create({
	collection: [] // table data
});
```

```html
<div [tableTools]="tableToolsInstance">
	<div *ngFor="let d of tableToolsInstance.data | async">
		{{d}}
	</div>
</div>
```

You can change the default order of data using `order` property in instance or its config.

You can change number of rows per page and allowed per-page options using `perPage` and `perPageOptions` properties.

### Sorting

Use `ttSort="field_name"` directive on column headers to enable column sorting. Order will be changed on click. Clicking with shift key enables sorting by multiple columns.
 
### Data filtering

Use `tt-search` component to create a search component (input). Typing text inside it will filter the data leaving only rows that match given search string (row is matched if any of its object values matches the search string).
 
You can add data filters via `filters` property using `TtFilterGroup` and `TtFilter` classes that extend `FormGroup` and `FormControl` respectively only difference being that `TtFilter` first argument is a filter config object.

```typescript
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
```

### Pagination

Use `tt-pagination` component to create pagination.

Use `tt-per-page` component to create a component that allows user to change default results per page number.

### Select rows

You can use `<tt-select [item]="row">` component inside each row to create a checkbox that allows user to select given row.

Use `tt-select-all` component to create a checkbox that selects/deselects all checkboxes created by `tt-select`.

Selected rows can be fetched by using `instance.selected.getSelected()` method.

### Export (requires angular-bootstrap4)

Use `tt-export` component to create a component that allows user to easily export currently visible data. Export takes data from HTML, so it's exported in a format that is visible in browser.

### Server-side processing

Use `url` and `resolver` properties to process data on server-side. 
