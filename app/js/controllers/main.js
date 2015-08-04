'use strict';

angular.module('clusterm.main', [])
    .controller('mainCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.test = function() {
            $state.transitionTo('about');
        }
        $scope.browse = function() {
            $state.transitionTo('browse');
        }
    }]);
