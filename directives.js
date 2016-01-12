define(['angular'], function (angular) {
    'use strict';

    var module = angular.module('grafana.directives');

    module.directive('metricQueryEditorAion', function() {
        return {
            controller: 'AionDatasourceQueryCtrl',
            templateUrl: 'public/plugins/aion/partials/query.editor.html'
        };
    });

    module.directive('metricQueryOptionsAion', function () {
        return {
            templateUrl: 'public/plugins/aion/partials/query.options.html'
        };
    });
});
