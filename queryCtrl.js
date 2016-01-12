define(['angular', 'lodash'], function(angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('AionDatasourceQueryCtrl', function($scope, uiSegmentSrv) {
        $scope.init = function () {
        }

        $scope.getObjectOptions = function () {
            return {};
        }

        $scope.getIndexOptions = function () {
            return {};
        }

        $scope.onChangeInternal = function () {
            $scope.get_data();
        }

        $scope.init();
    });
});
