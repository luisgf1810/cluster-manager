'use strict';

angular.module('clusterm.repository-selector-directive', [])
  .directive('repositorySelector', function(){
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/repository-selector-directive.html',      
      controller: 'RepositoryController',
    };
  });