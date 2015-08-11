'use strict';

/* Directives */


angular.module('clusterm.appver-directive', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
        }
    }]);

