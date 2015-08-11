'use strict';

/* Filters */

angular.module('clusterm.range-filter', []).
  filter('interpolate', ['version', function(version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
   }])
  .filter('range', [function() {
            return function(input, total, init) {
                total = parseInt(total);
                init = parseInt(init);
                for (var i=init; i<=total; i=i+1)
                    input.push(i);

                return input;
            };
        }
   ]);
