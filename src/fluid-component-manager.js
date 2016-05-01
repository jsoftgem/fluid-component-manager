(function () {
    'use strict';

    var Storage = require('storage');
    var storage = new Storage();
    var LockManager = require('hurt-locker').LockManager;
    var DynamicModuleLoader = require('dynamic-module-loader').DynamicModuleLoader;
    var path = require('path');
    var lodash = require('lodash');
    var FluidComponent = require('fluid-component');
    /*
     var Registry = require('npm-registry');
     var npm = new Registry();*/


    function FluidComponentManager() {

        var ideComponentManager = this;
        var componentModules = [];
        var _local = {};
        ideComponentManager.setNodeDir = setNodeDir;
        ideComponentManager.getNodeDir = getNodeDir;
        ideComponentManager.get = get;
        ideComponentManager.addComponentModule = addComponentModule;
        ideComponentManager.loadComponents = loadComponents;
        ideComponentManager.setNpmPath = setNpmPath;
        ideComponentManager.getNpmPath = getNpmPath;
        ideComponentManager.getHandler = getHandler;
        ideComponentManager.setHost = setHost;
        ideComponentManager.getHost = getHost;
        ideComponentManager.setLockDirPath = setLockDirPath;
        ideComponentManager.getLockDirPath = getLockDirPath;
        ideComponentManager.handlers = {};
        return ideComponentManager;

        function get(componentName) {
            var component = storage.get(componentName);
            resetFunctions(component);
            return component;
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
            var lockManager = new LockManager({
                lockDir: !!getLockDirPath() ? getLockDirPath() : './lock'
            });
            var dynamicModuleLoader = new DynamicModuleLoader({
                moduleInstallationDir: path.normalize(!!getNodeDir() ? getNodeDir() : './node_modules'),
                npmExecutablePath: getNpmPath(),
                modulePackageServerUrl: getHost(),
                lockManager: lockManager,
                npmSkipInstall: true
            });
            lodash.forEach(componentModules, function (module) {
                if (module instanceof Object) {
                    var modulePath = !!module.installed ? module.path : path.join(__dirname, module.path);
                    var component = require(modulePath);
                    if (component instanceof FluidComponent) {
                        storage.set(module.name, component);
                        component.setComponentManager(ideComponentManager);
                    } else {
                        throw 'Unsupported module instance: ' + module + ' - must be a subclass of FluidComponent.';
                    }
                }
                /*else {

                 npm.packages.get(module, function (err, data) {
                 if (err) {
                 error(err);
                 } else {
                 //TODO: Download npm package
                 }
                 });

                 }*/
            });
        }

        function setNodeDir(nodeDir) {
            _local.nodeDir = nodeDir;
        }

        function getNodeDir() {
            return _local.nodeDir;
        }

        function setNpmPath(npmPath) {
            _local.npmPath = npmPath;
        }

        function getNpmPath() {
            return _local.npmPath;
        }

        function setHost(host) {
            _local.host = host;
        }

        function getHost() {
            return _local.host;
        }

        function setLockDirPath(lockDirPath) {
            _local.lockDirPath = lockDirPath;
        }

        function getLockDirPath() {
            return _local.lockDirPath;
        }

    }


    module.exports = FluidComponentManager;

})();