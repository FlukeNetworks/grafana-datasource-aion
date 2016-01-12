define(['angular', 'lodash'], function(angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('AionDatasourceQueryCtrl', function($scope, uiSegmentSrv) {
        $scope.target.target = $scope.target.target || 'select metric';

        $scope.getOptions = function () {
            return {};
        }

        $scope.onChangeInternal = function () {
        }

        $scope.init();
    });
});
