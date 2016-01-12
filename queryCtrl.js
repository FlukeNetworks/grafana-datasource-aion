define(['angular', 'lodash'], function(angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('AionDatasourceQueryCtrl', function($scope, uiSegmentSrv) {
        $scope.init = function () {
            $scope.target.groupByField = $scope.target.groupByField || "time";
        }

        $scope.objectList = function (query, callback) {
            if (query !== '') {
                $scope.datasource.getSchema().then((result) => {
                    return result.data;
                }).then((schema) => {
                    return _.map(schema, (v, k) => {
                        return k;
                    });
                }).then((objects) => {
                    return _.filter(objects, (obj) => obj.startsWith(query));
                }).then(callback);
            } else {
                return null;
            }
        }

        $scope.init();
    });
});
