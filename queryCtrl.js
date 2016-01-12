define(['angular', 'lodash'], function(angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('AionDatasourceQueryCtrl', function($scope, uiSegmentSrv) {
        $scope.init = function () {
            $scope.target.groupByField = $scope.target.groupByField || "time";
        }

        $scope.init();
    });
});
