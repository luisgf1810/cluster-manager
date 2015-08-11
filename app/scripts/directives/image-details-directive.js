'use strict';

angular.module('clusterm.image-details-directive', [])
  .directive('imageDetails', function(){
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/image-details-directive.html',
      controller: 'ImageController',
    };
  });