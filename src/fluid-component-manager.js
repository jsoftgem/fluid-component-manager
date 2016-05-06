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
        ideComponentManager.setHandler = setHandler;
        return ideComponentManager;

        function get(param) {
            if (param instanceof Object) {
                loadComponent(param);
                var component = storage.get(param.name);
                resetFunctions(component);
                return component;
            } else {
                var component = storage.get(param);
                resetFunctions(component);
                return component;
            }

        }

        function getHandler(componentName) {
            return handlers[componentName];
        }

        function resetFunctions(component) {
            var keys = lodash.keys(component);
            lodash.forEach(keys, function (key) {
                if ((!key.match(/execute|scope|setComponentManager|componentManager|name|target|spec|requires|runs/g))) {
                    lodash.unset(component, key);
                }
            });
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
            if (!module.name) {
                throw 'Property name is required.';
            }
            var modulePath = !!module.installed ? module.path : path.join((module.dir ? module.dir : __dirname), module.path);
            var component = require(modulePath);
            component.setComponentManager(ideComponentManager);
            storage.set(module.name, component);
            if (component.requires) {
                loadRequires(component.requires);
            }
            if (component.runs) {
                runModules(component.runs);
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

        function runModules(modules) {
            if (modules instanceof Array) {
                runModule(modules)
            } else {
                var component = get(module);
                if (!component) {
                    throw 'Component ' + module + ' not loaded.';
                }
                component.execute();
            }
        }

        function runModule(array, index) {
            if (!index) {
                index = 0;
            }
            if (index < array.length) {
                var module = array[index];
                console.log('run', module);
                var component = get(module);
                if (!component) {
                    throw 'Component ' + module + ' not loaded.';
                }
                index++;
                component.execute(function (err) {
                    throw err;
                }, {
                    done: function () {
                        runModule(array, index);
                    }
                });
            }
        }

        function execute(error, name, context, options) {
            setTimeout(function () {
                try {
                    var targetComponent = get(options.target);
                    var handler = getHandler(options.target);
                    if (!handler) {
                        throw 'Execution failed. Missing handler function for component ' + options.target + '.';
                    }
                    if (targetComponent) {
                        if (handler instanceof Function) {
                            var returnValue = handler(name, options.local, targetComponent.scope, context);
                            if (context && context.done) {
                                context.done(returnValue);
                            }
                        } else if (handler instanceof String) {
                            runPluginHandler(getHandler(handler), handler, name, context, options);
                        }
                    }
                } catch (err) {
                    if (error) {
                        error(err);
                    }
                }
            });
        }

        function runPluginHandler(pluginHandler, handler, name, context, options) {
            if (pluginHandler instanceof Function) {
                pluginHandler(name, options.local, targetComponent.scope, context);
            } else {
                throw handler + ' handler is not a function;';
            }
        }

        function setHandler(name, handler) {
            if (handler) {
                lodash.set(handlers, name, handler);
            }
        }
    }

    module.exports = FluidComponentManager;

})();