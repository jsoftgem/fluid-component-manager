(function () {
    'use strict';

    var Storage = require('storage');
    var storage = new Storage();
    var path = require('path');
    var lodash = require('lodash');

    function FluidComponentManager() {

        var ideComponentManager = this;
        var componentModules = [];
        var handlers = {};
        ideComponentManager.get = get;
        ideComponentManager.addComponentModule = addComponentModule;
        ideComponentManager.loadComponents = loadComponents;
        ideComponentManager.execute = execute;
        ideComponentManager.logHandlers = logHandlers;
        return ideComponentManager;

        function get(param) {
            var component = {};
            if (param instanceof Object) {
                loadComponent(param);
                lodash.assignIn(component, storage.get(param.name));
                return component;
            } else {
                lodash.assignIn(component, storage.get(param));
                return component;
            }

        }

        function getHandler(componentName) {
            return handlers[componentName];
        }

        function addComponentModule(module) {
            try {
                componentModules.push(module);
            } catch (err) {
                return false;
            }
            return true;
        }

        function loadComponents(error) {
            try {
                lodash.forEach(componentModules, function (module) {
                    if (module instanceof Object) {
                        loadComponent(module);
                    } else {
                        loadComponent({name: module, installed: true});
                    }
                });
            } catch (err) {
                if (error) {
                    error(err);
                }
            }
        }

        function loadComponent(module) {
            if (!storage.get(module.name)) {
                if (!module.name) {
                    throw 'Property name is required.';
                }
                var modulePath = !!module.installed ? module.path : path.join((module.dir ? module.dir : __dirname), module.path);
                var component = require(modulePath);
                component.setComponentManager(ideComponentManager);
                storage.set(module.name, component);
                setHandler(module, component.name, component.__$);
                lodash.unset(component, '__$');
                if (component.requires) {
                    loadRequires(component.requires);
                    lodash.unset(component, 'requires');
                }
                if (component.runs) {
                    runModules(component.runs, function () {
                        lodash.unset(component, 'runs');
                    });
                }
            }
        }

        function loadRequires(requires) {
            if (requires instanceof Array) {
                lodash.forEach(requires, function (req) {
                    if (req instanceof Object) {
                        loadComponent(req);
                    } else {
                        loadComponent({name: req, installed: true});
                    }
                });
            } else {
                if (requires instanceof Object) {
                    loadComponent(requires);
                } else {
                    loadComponent({name: requires, installed: true});
                }

            }
        }

        function runModules(modules, done) {
            if (modules instanceof Array) {
                runModule(modules, undefined, done)
            } else {
                var component = get(module);
                if (!component) {
                    throw 'Component ' + module + ' not loaded.';
                }
                component.execute(function (err) {
                    throw err;
                }, {done: done});
            }
        }

        function runModule(array, index, done) {
            if (!index) {
                index = 0;
            }
            if (index < array.length) {
                var module = array[index];
                var component = get(module);
                if (!component) {
                    throw 'Component ' + module + ' not loaded.';
                }
                index++;
                component.execute(function (err) {
                    throw err;
                }, {
                    done: function () {
                        runModule(array, index, done);
                    }
                });
            } else {
                done();
            }
        }

        function execute(name, scope, context, options, callback) {
            setTimeout(function () {
                try {
                    var targetComponent = get(options.target);
                    var handler = getHandler(options.target).handler;
                    var target = options.target;
                    if (!handler) {
                        throw 'Execution failed. Missing handler function for component ' + target + '.';
                    }
                    if (targetComponent) {
                        if (handler instanceof Function) {
                            var returnValue = handler(name, options.local, scope, context);
                            callback(undefined, returnValue);
                        } else if (handler instanceof Array) {
                            var foundHandler = lodash.find(handler, function (hdlr) {
                                var hdl = getHandler(hdlr);
                                return !!hdl && hdl.name === name;
                            });
                            if (!foundHandler) {
                                throw 'Handler ' + name + ' is not found in ' + target + '.';
                            }
                            runPluginHandler(getHandler(foundHandler).handler, handler, name, context, options, scope, callback);
                        } else {
                            runPluginHandler(getHandler(handler).handler, handler, name, context, options, scope, callback);
                        }
                    }
                } catch (err) {
                    if (callback) {
                        callback(err);
                    }
                }
            });
        }

        function runPluginHandler(pluginHandler, handler, name, context, options, scope, callback) {
            if (pluginHandler instanceof Function) {
                var returnValue = pluginHandler(name, options.local, scope, context);
                callback(undefined, returnValue);
            } else {
                throw handler + ' handler is not a function;';
            }
        }

        function setHandler(module, name, handler) {
            if (handler) {
                lodash.set(handlers, module.name, {handler: handler, name: name});
            }
        }

        function logHandlers() {
            console.log('handlers', handlers);
        }
    }

    module.exports = FluidComponentManager;

})();