'use strict';

angular.module('clusterm.browse', [])
    .controller('browseCtrl', ['$scope', '$state', 'ngDialog', function($scope, $state, ngd) {
        $scope.titles = [];
        $scope.id = 0;

        $scope.titles[0]=""
        $scope.titles[1]="List of public containers images to be deployed inside the cluster. Every time a unit is submitted, the new version of the associated image will be downloaded"
        $scope.titles[2]="Deploy a group of unit (service) to the cluster. Each service inside the cluster is composed of one or more units, the most popular ones are Database, Agent, Connectors and Monitor"
        $scope.titles[3]="Load and update SW modules related to the cluster configuration. 3GPP Libraries, dictionaries and browser engines are quite often updated and deployed to the cluster"
        $scope.titles[4]="Health KPI metrics to control the cluster distributed system"
        $scope.titles[5]="Complete step by step wizard configurator to deploy a whole cluster with all the necessary services and modules"
        $scope.titles[6]="System information and verification tool"

        $scope.transit = function() {
            if ($scope.id!=0) {
                if ($scope.id==1) {
                    $state.transitionTo('repository-list');
                } else if ($scope.id==2)  {
                    $state.transitionTo('create');

                }
            }
        }
    }]);
