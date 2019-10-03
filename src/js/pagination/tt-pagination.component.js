/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.pagination').component('ttPagination', {
	require: {
		tableTools: '^tableTools'
	},
	controllerAs: 'vm',
	transclude: true,
	templateUrl: 'src/templates/pagination.html'
});