(function() {
  'use strict';
  /**
   *  @ngdoc overview
   *  @name ui.grid.infiniteScroll
   *
   *  @description
   *
   * #ui.grid.infiniteScroll
   *
   * <div class="alert alert-warning" role="alert"><strong>Beta</strong> This feature is ready for testing, but it either hasn't seen a lot of use or has some known bugs.</div>
   *
   * This module provides infinite scroll functionality to ui-grid
   *
   */
  var module = angular.module('ui.grid.infiniteScroll', ['ui.grid']);
  /**
   *  @ngdoc service
   *  @name ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
   *
   *  @description Service for infinite scroll features
   */
  module.service('uiGridInfiniteScrollService', ['gridUtil', '$compile', '$timeout', 'uiGridConstants', 'ScrollEvent', '$q', function (gridUtil, $compile, $timeout, uiGridConstants, ScrollEvent, $q) {

    var service = {

      /**
       * @ngdoc function
       * @name initializeGrid
       * @methodOf ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
       * @description This method register events and methods into grid public API
       */

      initializeGrid: function(grid, $scope) {
        service.defaultGridOptions(grid.options);

        if (!grid.options.enableInfiniteScroll){
          return;
        }

        grid.infiniteScroll = { dataLoading: false };
        service.setScrollDirections( grid, grid.options.infiniteScrollUp, grid.options.infiniteScrollDown );
          grid.api.core.on.scrollEnd($scope, service.handleScroll);

        /**
         *  @ngdoc object
         *  @name ui.grid.infiniteScroll.api:PublicAPI
         *
         *  @description Public API for infinite scroll feature
         */
        var publicApi = {
          events: {
            infiniteScroll: {

              /**
               * @ngdoc event
               * @name needLoadMoreData
               * @eventOf ui.grid.infiniteScroll.api:PublicAPI
               * @description This event fires when scroll reaches bottom percentage of grid
               * and needs to load data
               */

              needLoadMoreData: function ($scope, fn) {
              },

              /**
               * @ngdoc event
               * @name needLoadMoreDataTop
               * @eventOf ui.grid.infiniteScroll.api:PublicAPI
               * @description This event fires when scroll reaches top percentage of grid
               * and needs to load data
               */

              needLoadMoreDataTop: function ($scope, fn) {
              }
            }
          },
          methods: {
            infiniteScroll: {

              /**
               * @ngdoc function
               * @name dataLoaded
               * @methodOf ui.grid.infiniteScroll.api:PublicAPI
               * @description Call this function when you have loaded the additional data
               * requested.  You should set scrollUp and scrollDown to indicate
               * whether there are still more pages in each direction.
               *
               * If you call dataLoaded without first calling `saveScrollPercentage` then we will
               * scroll the user to the start of the newly loaded data, which usually gives a smooth scroll
               * experience, but can give a jumpy experience with large `infiniteScrollRowsFromEnd` values, and
               * on variable speed internet connections.  Using `saveScrollPercentage` as demonstrated in the tutorial
               * should give a smoother scrolling experience for users.
               *
               * See infinite_scroll tutorial for example of usage
               * @param {boolean} scrollUp if set to false flags that there are no more pages upwards, so don't fire
               * any more infinite scroll events upward
               * @param {boolean} scrollDown if set to false flags that there are no more pages downwards, so don't
               * fire any more infinite scroll events downward
               * @returns {promise} a promise that is resolved when the grid scrolling is fully adjusted.  If you're
               * planning to remove pages, you should wait on this promise first, or you'll break the scroll positioning
               */
              dataLoaded: function( scrollUp, scrollDown ) {
                service.setScrollDirections(grid, scrollUp, scrollDown);

                var promise = service.adjustScroll(grid).then(function() {
                  grid.infiniteScroll.dataLoading = false;
                });

                return promise;
              },

              /**
               * @ngdoc function
               * @name resetScroll
               * @methodOf ui.grid.infiniteScroll.api:PublicAPI
               * @description Call this function when you have taken some action that makes the current
               * scroll position invalid.  For example, if you're using external sorting and you've resorted
               * then you might reset the scroll, or if you've otherwise substantially changed the data, perhaps
               * you've reused an existing grid for a new data set
               *
               * You must tell us whether there is data upwards or downwards after the reset
               *
               * @param {boolean} scrollUp flag that there are pages upwards, fire
               * infinite scroll events upward
               * @param {boolean} scrollDown flag that there are pages downwards, so
               * fire infinite scroll events downward
               * @returns {promise} promise that is resolved when the scroll reset is complete
               */
              resetScroll: function( scrollUp, scrollDown ) {
                service.setScrollDirections( grid, scrollUp, scrollDown);

                return service.adjustInfiniteScrollPosition(grid, 0);
              },


              /**
               * @ngdoc function
               * @name saveScrollPercentage
               * @methodOf ui.grid.infiniteScroll.api:PublicAPI
               * @description Saves the scroll percentage and number of visible rows before you adjust the data,
               * used if you're subsequently going to call `dataRemovedTop` or `dataRemovedBottom`
               */
              saveScrollPercentage: function() {
                grid.infiniteScroll.prevScrolltopPercentage = grid.renderContainers.body.prevScrolltopPercentage;
                grid.infiniteScroll.previousVisibleRows = grid.renderContainers.body.visibleRowCache.length;
              },


              /**
               * @ngdoc function
               * @name dataRemovedTop
               * @methodOf ui.grid.infiniteScroll.api:PublicAPI
               * @description Adjusts the scroll position after you've removed data at the top
               * @param {boolean} scrollUp flag that there are pages upwards, fire
               * infinite scroll events upward
               * @param {boolean} scrollDown flag that there are pages downwards, so
               * fire infinite scroll events downward
               */
              dataRemovedTop: function( scrollUp, scrollDown ) {
                service.dataRemovedTop( grid, scrollUp, scrollDown );
              },

              /**
               * @ngdoc function
               * @name dataRemovedBottom
               * @methodOf ui.grid.infiniteScroll.api:PublicAPI
               * @description Adjusts the scroll position after you've removed data at the bottom
               * @param {boolean} scrollUp flag that there are pages upwards, fire
               * infinite scroll events upward
               * @param {boolean} scrollDown flag that there are pages downwards, so
               * fire infinite scroll events downward
               */
              dataRemovedBottom: function( scrollUp, scrollDown ) {
                service.dataRemovedBottom( grid, scrollUp, scrollDown );
              },

              /**
               * @ngdoc function
               * @name setScrollDirections
               * @methodOf ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
               * @description Sets the scrollUp and scrollDown flags, handling nulls and undefined,
               * and also sets the grid.suppressParentScroll
               * @param {boolean} scrollUp whether there are pages available up - defaults to false
               * @param {boolean} scrollDown whether there are pages available down - defaults to true
               */
              setScrollDirections:  function ( scrollUp, scrollDown ) {
                service.setScrollDirections( grid, scrollUp, scrollDown );
              }

            }
          }
        };
        grid.api.registerEventsFromObject(publicApi.events);
        grid.api.registerMethodsFromObject(publicApi.methods);
      },


      defaultGridOptions: function (gridOptions) {
        //default option to true unless it was explicitly set to false
        /**
         *  @ngdoc object
         *  @name ui.grid.infiniteScroll.api:GridOptions
         *
         *  @description GridOptions for infinite scroll feature, these are available to be
         *  set using the ui-grid {@link ui.grid.class:GridOptions gridOptions}
         */

        /**
         *  @ngdoc object
         *  @name enableInfiniteScroll
         *  @propertyOf  ui.grid.infiniteScroll.api:GridOptions
         *  @description Enable infinite scrolling for this grid
         *  <br/>Defaults to true
         */
        gridOptions.enableInfiniteScroll = gridOptions.enableInfiniteScroll !== false;

        /**
         * @ngdoc property
         * @name infiniteScrollRowsFromEnd
         * @propertyOf ui.grid.class:GridOptions
         * @description This setting controls how close to the end of the dataset a user gets before
         * more data is requested by the infinite scroll, whether scrolling up or down.  This allows you to
         * 'prefetch' rows before the user actually runs out of scrolling.
         *
         * Note that if you set this value too high it may give jumpy scrolling behaviour, if you're getting
         * this behaviour you could use the `saveScrollPercentageMethod` right before loading your data, and we'll
         * preserve that scroll position
         *
         * <br> Defaults to 20
         */
        gridOptions.infiniteScrollRowsFromEnd = gridOptions.infiniteScrollRowsFromEnd || 20;

        /**
         * @ngdoc property
         * @name infiniteScrollUp
         * @propertyOf ui.grid.class:GridOptions
         * @description Whether you allow infinite scroll up, implying that the first page of data
         * you have displayed is in the middle of your data set.  If set to true then we trigger the
         * needMoreDataTop event when the user hits the top of the scrollbar.
         * <br> Defaults to false
         */
        gridOptions.infiniteScrollUp = gridOptions.infiniteScrollUp === true;

        /**
         * @ngdoc property
         * @name infiniteScrollDown
         * @propertyOf ui.grid.class:GridOptions
         * @description Whether you allow infinite scroll down, implying that the first page of data
         * you have displayed is in the middle of your data set.  If set to true then we trigger the
         * needMoreData event when the user hits the bottom of the scrollbar.
         * <br> Defaults to true
         */
        gridOptions.infiniteScrollDown = gridOptions.infiniteScrollDown !== false;
      },


      /**
       * @ngdoc function
       * @name setScrollDirections
       * @methodOf ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
       * @description Sets the scrollUp and scrollDown flags, handling nulls and undefined,
       * and also sets the grid.suppressParentScroll
       * @param {grid} grid the grid we're operating on
       * @param {boolean} scrollUp whether there are pages available up - defaults to false
       * @param {boolean} scrollDown whether there are pages available down - defaults to true
       */
      setScrollDirections:  function ( grid, scrollUp, scrollDown ) {
        grid.infiniteScroll.scrollUp = ( scrollUp === true );
        grid.suppressParentScrollUp = ( scrollUp === true );

        grid.infiniteScroll.scrollDown = ( scrollDown !== false);
        grid.suppressParentScrollDown = ( scrollDown !== false);
      },


      /**
       * @ngdoc function
       * @name handleScroll
       * @methodOf ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
       * @description Called whenever the grid scrolls, determines whether the scroll should
       * trigger an infinite scroll request for more data
       * @param {object} args the args from the event
       */
      handleScroll:  function (args) {
        // don't request data if already waiting for data, or if source is coming from ui.grid.adjustInfiniteScrollPosition() function
        if ( args.grid.infiniteScroll && args.grid.infiniteScroll.dataLoading || args.source === 'ui.grid.adjustInfiniteScrollPosition' ){
          return;
        }

        if (args.y) {
          var percentage;
          var targetPercentage = args.grid.options.infiniteScrollRowsFromEnd / args.grid.renderContainers.body.visibleRowCache.length;
          if (args.grid.scrollDirection === uiGridConstants.scrollDirection.UP ) {
            percentage = args.y.percentage;
            if (percentage <= targetPercentage){
              service.loadData(args.grid);
            }
          } else if (args.grid.scrollDirection === uiGridConstants.scrollDirection.DOWN) {
            percentage = 1 - args.y.percentage;
            if (percentage <= targetPercentage){
              service.loadData(args.grid);
            }
          }
        }
      },


      /**
       * @ngdoc function
       * @name loadData
       * @methodOf ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
       * @description This function fires 'needLoadMoreData' or 'needLoadMoreDataTop' event based on scrollDirection
       * and whether there are more pages upwards or downwards.  It also stores the number of rows that we had previously,
       * and clears out any saved scroll position so that we know whether or not the user calls `saveScrollPercentage`
       * @param {Grid} grid the grid we're working on
       */
      loadData: function (grid) {
        // save number of currently visible rows to calculate new scroll position later - we know that we want
        // to be at approximately the row we're currently at
        grid.infiniteScroll.previousVisibleRows = grid.renderContainers.body.visibleRowCache.length;
        grid.infiniteScroll.direction = grid.scrollDirection;
        delete grid.infiniteScroll.prevScrolltopPercentage;

        if (grid.scrollDirection === uiGridConstants.scrollDirection.UP && grid.infiniteScroll.scrollUp ) {
          grid.infiniteScroll.dataLoading = true;
          grid.api.infiniteScroll.raise.needLoadMoreDataTop();
        } else if (grid.scrollDirection === uiGridConstants.scrollDirection.DOWN && grid.infiniteScroll.scrollDown ) {
          grid.infiniteScroll.dataLoading = true;
          grid.api.infiniteScroll.raise.needLoadMoreData();
        }
      },


      /**
       * @ngdoc function
       * @name adjustScroll
       * @methodOf ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
       * @description Once we are informed that data has been loaded, adjust the scroll position to account for that
       * addition and to make things look clean.
       *
       * If we're scrolling up we scroll to the first row of the old data set -
       * so we're assuming that you would have gotten to the top of the grid (from the 20% need more data trigger) by
       * the time the data comes back.  If we're scrolling down we scoll to the last row of the old data set - so we're
       * assuming that you would have gotten to the bottom of the grid (from the 80% need more data trigger) by the time
       * the data comes back.
       *
       * Neither of these are good assumptions, but making this a smoother experience really requires
       * that trigger to not be a percentage, and to be much closer to the end of the data (say, 5 rows off the end).  Even then
       * it'd be better still to actually run into the end.  But if the data takes a while to come back, they may have scrolled
       * somewhere else in the mean-time, in which case they'll get a jump back to the new data.  Anyway, this will do for
       * now, until someone wants to do better.
       * @param {Grid} grid the grid we're working on
       * @returns {promise} a promise that is resolved when scrolling has finished
       */
      adjustScroll: function(grid){
        var promise = $q.defer();
        $timeout(function () {
          var newPercentage;

          if ( grid.infiniteScroll.direction === undefined ){
            // called from initialize, tweak our scroll up a little
            service.adjustInfiniteScrollPosition(grid, 0);
          }

          var newVisibleRows = grid.renderContainers.body.visibleRowCache.length;
          var oldPercentage, oldTopRow;
          var halfViewport = grid.getViewportHeight() / grid.options.rowHeight / 2;

          if ( grid.infiniteScroll.direction === uiGridConstants.scrollDirection.UP ){
            oldPercentage = grid.infiniteScroll.prevScrolltopPercentage || 0;
            oldTopRow = oldPercentage * grid.infiniteScroll.previousVisibleRows;
            newPercentage = ( newVisibleRows - grid.infiniteScroll.previousVisibleRows + oldTopRow + halfViewport ) / newVisibleRows;
            service.adjustInfiniteScrollPosition(grid, newPercentage);
            $timeout( function() {
              promise.resolve();
            });
          }

          if ( grid.infiniteScroll.direction === uiGridConstants.scrollDirection.DOWN ){
            oldPercentage = grid.infiniteScroll.prevScrolltopPercentage || 1;
            oldTopRow = oldPercentage * grid.infiniteScroll.previousVisibleRows;
            newPercentage = ( oldTopRow - halfViewport ) / newVisibleRows;
            service.adjustInfiniteScrollPosition(grid, newPercentage);
            $timeout( function() {
              promise.resolve();
            });
          }
        }, 0);

        return promise.promise;
      },


      /**
       * @ngdoc function
       * @name adjustInfiniteScrollPosition
       * @methodOf ui.grid.infiniteScroll.service:uiGridInfiniteScrollService
       * @description This function fires 'needLoadMoreData' or 'needLoadMoreDataTop' event based on scrollDirection
       * @param {Grid} grid the grid we're working on
       * @param {number} percentage the percentage through the grid that we want to scroll to
       * @returns {promise} a promise that is resolved when the scrolling finishes
       */
      adjustInfiniteScrollPosition: function (grid, percentage) {
        var scrollEvent = new ScrollEvent(grid, null, null, 'ui.grid.adjustInfiniteScrollPosition');

        //for infinite scroll, if there are pages upwards then never allow it to be at the zero position so the up button can be active
        if ( percentage === 0 && grid.infiniteScroll.scrollUp ) {
          scrollEvent.y = {pixels: 1};
        }
        else {
          scrollEvent.y = {percentage: percentage};
        }
        grid.scrollContainers('', scrollEvent);
      },


      /**
       * @ngdoc function
       * @name dataRemovedTop
       * @methodOf ui.grid.infiniteScroll.api:PublicAPI
       * @description Adjusts the scroll position after you've removed data at the top. You should
       * have called `saveScrollPercentage` before you remove the data, and if you're doing this in
       * response to a `needMoreData` you should wait until the promise from `loadData` has resolved
       * before you start removing data
       * @param {Grid} grid the grid we're working on
       * @param {boolean} scrollUp flag that there are pages upwards, fire
       * infinite scroll events upward
       * @param {boolean} scrollDown flag that there are pages downwards, so
       * fire infinite scroll events downward
       * @returns {promise} a promise that is resolved when the scrolling finishes
       */
      dataRemovedTop: function( grid, scrollUp, scrollDown ) {
        service.setScrollDirections( grid, scrollUp, scrollDown );

        var newVisibleRows = grid.renderContainers.body.visibleRowCache.length;
        var oldScrollRow = grid.infiniteScroll.prevScrolltopPercentage * grid.infiniteScroll.previousVisibleRows;

        // since we removed from the top, our new scroll row will be the old scroll row less the number
        // of rows removed
        var newScrollRow = oldScrollRow - ( grid.infiniteScroll.previousVisibleRows - newVisibleRows );
        var newScrollPercent = newScrollRow / newVisibleRows;

        return service.adjustInfiniteScrollPosition( grid, newScrollPercent );
      },

      /**
       * @ngdoc function
       * @name dataRemovedBottom
       * @methodOf ui.grid.infiniteScroll.api:PublicAPI
       * @description Adjusts the scroll position after you've removed data at the bottom.  You should
       * have called `saveScrollPercentage` before you remove the data, and if you're doing this in
       * response to a `needMoreData` you should wait until the promise from `loadData` has resolved
       * before you start removing data
       * @param {Grid} grid the grid we're working on
       * @param {boolean} scrollUp flag that there are pages upwards, fire
       * infinite scroll events upward
       * @param {boolean} scrollDown flag that there are pages downwards, so
       * fire infinite scroll events downward
       */
      dataRemovedBottom: function( grid, scrollUp, scrollDown ) {
        service.setScrollDirections( grid, scrollUp, scrollDown );

        var newVisibleRows = grid.renderContainers.body.visibleRowCache.length;
        var oldScrollRow = grid.infiniteScroll.prevScrolltopPercentage * grid.infiniteScroll.previousVisibleRows;

        // since we removed from the bottom, our new scroll row will be same as the old scroll row
        var newScrollPercent = oldScrollRow / newVisibleRows;

        return service.adjustInfiniteScrollPosition( grid, newScrollPercent );
      }
    };
    return service;
  }]);
  /**
   *  @ngdoc directive
   *  @name ui.grid.infiniteScroll.directive:uiGridInfiniteScroll
   *  @element div
   *  @restrict A
   *
   *  @description Adds infinite scroll features to grid
   *
   *  @example
   <example module="app">
   <file name="app.scripts">
   var app = angular.module('app', ['ui.grid', 'ui.grid.infiniteScroll']);

   app.controller('MainCtrl', ['$scope', function ($scope) {
      $scope.data = [
        { name: 'Alex', car: 'Toyota' },
            { name: 'Sam', car: 'Lexus' }
      ];

      $scope.columnDefs = [
        {name: 'name'},
        {name: 'car'}
      ];
    }]);
   </file>
   <file name="index.html">
   <div ng-controller="MainCtrl">
   <div ui-grid="{ data: data, columnDefs: columnDefs }" ui-grid-infinite-scroll="20"></div>
   </div>
   </file>
   </example>
   */

  module.directive('uiGridInfiniteScroll', ['uiGridInfiniteScrollService',
    function (uiGridInfiniteScrollService) {
      return {
        priority: -200,
        scope: false,
        require: '^uiGrid',
        compile: function($scope, $elm, $attr){
          return {
            pre: function($scope, $elm, $attr, uiGridCtrl) {
              uiGridInfiniteScrollService.initializeGrid(uiGridCtrl.grid, $scope);
            },
            post: function($scope, $elm, $attr) {
            }
          };
        }
      };
    }]);

})();
