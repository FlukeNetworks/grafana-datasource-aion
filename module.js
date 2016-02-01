define(['./datasource'], function (aionDatasource) {
    'use strict';

    function metricsQueryEditor() {
        return {
            controller: "AionDatasourceQueryCtrl",
            templateUrl: "public/plugins/aion/partials/query.editor.html",
        };
    }

    function configView() {
        return {
            templateUrl: "public/plugins/aion/partials/config.html",
        };
    }

    return {
        Datasource: aionDatasource,
        metricsQueryEditor: metricsQueryEditor,
        configView: configView,
    };
});
