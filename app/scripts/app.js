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
    'clusterm.appver-directive',
    'clusterm.repository-selector-directive',
    'clusterm.repository-list-directive',
    'clusterm.tag-list-directive',
    'clusterm.image-details-directive',
    'clusterm.app-mode-services',
    'clusterm.app-version-services',
    'clusterm.registry-services',
    'clusterm.bjs-service',
    'clusterm.range-filter',
    'clusterm.uuid-service',
    'clusterm.create',
    'clusterm.browse',
    'clusterm.browse2',
    'clusterm.about'
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
            .state('about',
            {   url: '/about',
                templateUrl: 'partials/about.html',
                controller: 'aboutCtrl'
            })
            .state('repository-list',
            {   url: '/repository-list',
                templateUrl: 'partials/repository/repository-list.html',
                controller: 'repositorylistCtrl'
            })
}]).
run(['$state', function ($state) {
        $state.transitionTo('browse');
}]);

