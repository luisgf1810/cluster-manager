'use strict';


angular.module('clusterm.repository-controller', ['registry-services', 'app-mode-services'])
  .controller('repositorylistCtr', ['$scope', '$route', '$routeParams', '$location', '$modal', 'Repository', 'AppMode',
  function($scope, $route, $routeParams, $location, $modal, Repository, AppMode){
  
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    
    $scope.searchTerm = $route.current.params.searchTerm;
    $scope.repositoryUser = $route.current.params.repositoryUser;
    $scope.repositoryName = $route.current.params.repositoryName;
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;
  
    $scope.repositories = Repository.query();
    
    $scope.appMode = AppMode.query();
    
    // selected repos
    $scope.selectedRepositories = [];
    
    // helper method to get selected tags
    $scope.selectedRepos = function selectedRepos() {
      return filterFilter($scope.repositories, { selected: true });
    };
    
    // watch fruits for changes
    $scope.$watch('repositories|filter:{selected:true}', function(nv) {
      $scope.selectedRepositories = nv.map(function (repo) {
        return repo.name;
      });
    }, true);
    
    $scope.openConfirmRepoDeletionDialog = function(size) {
      var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'views/modalConfirmDeleteItems.html',
          controller: 'DeleteRepositoryController',
          size: size,
          resolve: {
            items: function () {
              return $scope.selectedRepositories;
            },
            information: function() {
              return 'A repository is a collection of tags. \
                      A tag is basically a reference to an image. \
                      If no references to an image exist, the image will be scheduled for automatic deletion. \
                      That said, if you remove a tag, you remove a reference to an image. \
                      Your image data may get lost, if no other tag references it. \
                      If you delete a repository, you delete all tags associated with it. \
                      Are you sure, you want to delete the following repositories?';
            }
          }
      });
    };
    
  }]);
