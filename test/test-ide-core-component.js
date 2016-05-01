(function () {
    'use strict';
    var FluidComponent = require('fluid-component');
    var events = new require('events');
    var eventEmitter = new events.EventEmitter();
    var lodash = require('lodash');
    var fluidComponent = new FluidComponent();

    var ideCoreComponent = fluidComponent.component('ide-core', {
        handler: function (source, local, scope, context) {
            var interceptors = scope.interceptors;
            if (!interceptors) {
                interceptors = {};
                scope.interceptors = interceptors;
            }
            if (source === 'properties') {
                var propertyInterceptors = interceptors[source];
                if (propertyInterceptors && !!propertyInterceptors.length) {
                    executeInterceptor(propertyInterceptors, function (err) {
                            throw err;
                        }, ideCoreComponent.name, local, source,
                        function () {
                            if (local.version) {
                                scope.version = local.version;
                            }
                        }
                    );
                } else {
                    if (local.version) {
                        scope.version = local.version;
                    }
                }
            } else if (source === 'event') {
                if (local.name) {
                    if (!local.action) {
                        throw 'Event action is required (action:Function).';
                    }
                    eventEmitter.on(local.name, local.action);
                }
            } else if (source === 'process') {
                if (!local.event) {
                    throw 'Specifiy an event for this process';
                }
                eventEmitter.emit(local.event);
            } else if (source === 'interceptor') {

                if (!local.target) {
                    throw 'Specify a target component to intercept for ' + name + '.';
                }

                if (!local.action) {
                    throw 'Action is required (action:Function or action:String).';
                }

                var target = lodash.get(scope.interceptors, local.target);

                if (!target) {
                    target = [];
                    lodash.set(scope.interceptors, local.target, target);
                }

                if (local.action instanceof Function) {
                    target.push(local.action);
                } else {
                    target.push(function (error, context) {
                        var component = ideCoreComponent.componentManager.get(local.action);
                        component.execute(error, context);
                    });
                }
            }
            if (!!context && context.interceptor) {
                context.proceed();
            }
        },
        local: {
            version: '0.1.0'
        }
    });


    function executeInterceptor(interceptors, error, source, local, interceptorName, done, index) {
        if (!index) {
            index = 0
        }
        try {
            if (index < interceptors.length) {
                var interceptor = interceptors[index];
                index++;
                interceptor(error, {
                    source: source,
                    interceptor: interceptorName,
                    local: local,
                    proceed: function () {
                        executeInterceptor(interceptors, error, source, local, interceptorName, done, index);
                    }
                });
            } else {
                done();
            }
        } catch (err) {
            error(err);
        }
    }

    module.exports = ideCoreComponent;
})();