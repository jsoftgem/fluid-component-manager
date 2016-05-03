(function () {
    'use strict';

    var Storage = require('storage');
    var storage = new Storage();
    var path = require('path');
    var lodash = require('lodash');

    function FluidComponentManager() {

        var ideComponentManager = this;
        var componentModules = [];
        var _local = {};
        ideComponentManager.get = get;
        ideComponentManager.addComponentModule = addComponentModule;
        ideComponentManager.loadComponents = loadComponents;
        ideComponentManager.getHandler = getHandler;
        ideComponentManager.handlers = {};
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
            return ideComponentManager.handlers[componentName];
        }

        function resetFunctions(component) {
            var keys = lodash.keys(component);
            lodash.forEach(keys, function (key) {
                if ((!key.match(/execute|scope|setComponentManager|componentManager|name/g))) {
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

        }
    }


    module.exports = FluidComponentManager;

})();