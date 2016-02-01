define(['angular', 'lodash', 'app/core/utils/datemath', './queryCtrl'], function(angular, _, dateMath) {
    'use strict';

    var module = angular.module('grafana.services');

    /** @ngInject */
    function AionDatasource(instanceSettings, $q, backendSrv, templateSrv) {
        this.url = instanceSettings.url

        this.query = function(options) {
            var queryParams = {
                from: aionTime(options.rangeRaw.from),
                to: aionTime(options.rangeRaw.to)
            };
            var promises = _.map(options.targets, (target) => {
                var metricName = [target.object, target.index + "=" + target.values, target.field].join('.');

                return aionPromise(this, "/" + [target.object, target.index, target.values].join("/"), [], queryParams).then((response) => {
                    return response;
                }).then((response) => response.data).then((data) => {
                    return _.filter(data, (obj) => {
                        return ! _.isNull(obj[target.field]);
                    });
                }).then((data) => {
                    return _.map(data, (obj) => {
                        return [obj[target.field], obj[target.groupByField]];
                    });
                }).then((datapoints) => {
                    return {
                        target: metricName,
                        datapoints: datapoints
                    };
                })
            });
            return $q.all(promises)
                .then((results) => {
                    return {
                        data: results
                    };
                });
        }

        this.testDatasource = function() {
            return aionPromise(this, "/version", [], {}).then((version) => {
                return {
                    status: "success",
                    message: "Data source is working",
                    title: "Success"
                };
            });
        }

        this.getSchema = function () {
            return aionPromise(this, "/schema", [], {});
        }

        this.getObjectConfig = function (name) {
            return aionPromise(this, "/schema/" + name, [], {});
        }

        //AionDatasource.prototype.listColumns = function(seriesName) {
        //    seriesName = templateSrv.replace(seriesName);

        //    return aionPromise(this, "/schema", [], {}).then((schema) => {
        //        return schema[seriesName];
        //    })
        //}

        //AionDatasource.prototype.listSeries = function(query) {
        //    return aionPromise(this, "/schema", [], {}).then((schema) => {
        //        return _.map(schema, (objectName, fields) => {
        //            return objectName;
        //        });
        //    });
        //}

        function aionPromise(aion, basePath, pathParameters, queryParameters) {
            var deferred = $q.defer();
            var url = aion.url + basePath;
            _.forEach(pathParameters, function(pathParam) {
                url = url + "/" + pathParam;
            });

            var first = true
            _.forEach(queryParameters, (v, k) => {
                if (first) {
                    first = false;
                    url = url + "?"
                } else {
                    url = url + "&"
                }
                url = url + k + "=" + v;
            });

            return backendSrv.datasourceRequest({
                url: url,
                method: 'GET'
            });
        }

        function aionTime(date, roundUp) {
            if (_.isString(date)) {
                if (date === 'now') {
                    date = new Date()
                } else {
                    date = dateMath.parse(date, roundUp)
                }
            }
            return date.toISOString();
        }
    }

    return AionDatasource;
});
