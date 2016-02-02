define(['angular', 'lodash', 'app/core/utils/datemath', './queryCtrl'], function(angular, _, dateMath) {
    'use strict';

    var module = angular.module('grafana.services');

    /** @ngInject */
    function AionDatasource(instanceSettings, $q, backendSrv, templateSrv) {
        this.url = instanceSettings.url;

        this.aionQuery = function aionQuery(queryParams, target) {
            return aionPromise(this, "/" + [target.object, target.index, target.values].join("/"), [], queryParams).then((response) => {
                return response;
            }).then((response) => response.data).then((data) => {
                return _.filter(data, (obj) => {
                    return ! _.isNull(obj[target.field]);
                });
            });
        }

        function getMetricName(target) {
            return [target.object, target.index + "=" + target.values, target.field].join('.');
        }

        this.query = function(options) {
            var queryParams = aionQueryParameters(options);
            var promises = _.map(options.targets, (target) => {
                var metricName = getMetricName(target);
                return this.aionQuery(queryParams, target)
                    .then((data) => {
                        return _.map(data, (obj) => {
                            return [obj[target.field], obj[target.groupByField]];
                        });
                    }).then((datapoints) => {
                        return {
                            target: metricName,
                            datapoints: datapoints,
                        };
                    });
            });
            return $q.all(promises)
                .then((results) => {
                    return {
                        data: results
                    };
                });
        }

        function aionStringify(value) {
            if (_.isString(value)) {
                return value;
            }
            return JSON.stringify(value);
        }

        this.annotationQuery = function(options) {
            console.log(options);
            var queryParams = aionQueryParameters(options);
            return this.aionQuery(queryParams, options.annotation)
                .then((data) => {
                    return _.map(data, (obj) => {
                        return {
                            annotation: options.annotation,
                            time: obj[options.annotation.groupByField],
                            title: getMetricName(options.annotation),
                            tags: "",
                            text: aionStringify(obj[options.annotation.field]),
                        };
                    });
                }).then((annotations) => {
                    console.log(annotations);
                    return annotations;
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

        function aionQueryParameters(options) {
            return {
                from: aionTime(options.rangeRaw.from),
                to: aionTime(options.rangeRaw.to)
            };
        }
    }

    return AionDatasource;
});
