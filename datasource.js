define(['angular', 'lodash', 'app/core/utils/datemath', './queryCtrl', './directives'], function(angular, _, dateMath) {
    'use strict';

    var module = angular.module('grafana.services');

    module.factory('AionDatasource', function($q, backendSrv, templateSrv) {
        function AionDatasource(datasource) {
            this.url = datasource.url
        }

        AionDatasource.prototype.query = function(options) {
            var queryParams = {
                from: aionTime(options.rangeRaw.from),
                to: aionTime(options.rangeRaw.to)
            };
            var promises = _.map(options.targets, (target) => {
                return aionPromise(this, "/" + target.target, [], queryParams);
            });
            return $q.all(promises)
                .then((results) => {
                    return _.flatten(results, true);
                }).then((responses) => {
                    return _.map(responses, (response) => {
                        return response.data;
                    });
                }).then((result) => {
                    var series = _.map(result, (objs) => {
                        var filteredObjs = _.filter(objs, (obj) => {
                            return ! _.isNull(obj.value);
                        });
                        var arraysToReturn = _.map(filteredObjs, (obj) => {
                            return [obj.value, obj.time];
                        });
                        return arraysToReturn;
                    });
                    series = _.reduce(series, (a, b) => {
                        return a.concat(b);
                    }, []);
                    series = _.filter(series, (a) => {
                        return _.size(a) > 0;
                    });
                    var toReturn = [{
                        target: options.targets[0].target,
                        datapoints: series
                    }];
                    console.log(toReturn);
                    return toReturn;
                }).then((results) => {
                    return {
                        data: results
                    };
                });
        }

        AionDatasource.prototype.testDatasource = function() {
            return aionPromise(this, "/version", [], {}).then((version) => {
                return {
                    status: "success",
                    message: "Data source is working",
                    title: "Success"
                };
            });
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

        return AionDatasource;
    });
});