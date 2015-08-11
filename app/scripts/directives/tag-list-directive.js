'use strict';

angular.module('clusterm.tag-list-directive', [])
  .directive('tagList', function(){
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/tag-list-directive.html',
      controller: 'TagController',
    };
  });
