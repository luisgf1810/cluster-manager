'use strict';

// Declare app level module which depends on filters, and services
angular.module('clusterm', [
    'ui.router',
    'ngResource',
    'ngGrid',
    'ngDialog',
    'ui.codemirror',
    'nvd3',
    'clusterm.main',
    'clusterm.filters',
    'clusterm.services',
    'clusterm.directives',
    'clusterm.create',
    'clusterm.browse',
    'clusterm.browse2',
    'clusterm.test'
]).
config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('create',
            {   url: '/create',
                templateUrl: 'partials/create.html',
                controller: 'createCtrl'
            })
            .state('browse',
            {   url: '/browse',
                templateUrl: 'partials/browse.html',
                controller: 'browseCtrl'
            })
            .state('browse2',
            {   url: '/browse2',
                templateUrl: 'partials/browse2.html',
                controller: 'browse2Ctrl'
            })
            .state('test',
            {   url: '/test',
                templateUrl: 'partials/test.html',
                controller: 'testCtrl'
            })

}]).
run(['$state', function ($state) {
        $state.transitionTo('browse');
}]);

