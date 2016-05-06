(function () {
    'use strict';

    var lodash = require('lodash');
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();

    module.exports = fluidComponent.component('hello-core', {
        requires: [{
            name: 'process-handler',
            path: 'test-core-process.handler.js',
            dir: __dirname
        }, {
            name: 'event-handler',
            path: 'test-core-event.handler.js',
            dir: __dirname
        }, {
            name: 'event-save',
            path: 'test-core-save.js',
            dir: __dirname
        }, {
            name: 'process-save',
            path: 'test-core-process.js',
            dir: __dirname
        }, {
            name: 'plugin-handler',
            path: 'test-core-plugin.handler.js',
            dir: __dirname
        }],
        runs: ['process-handler', 'event-handler', 'event-save'],
        handler: function (source, local, scope, context) {
            if (!scope.$handlers) {
                scope.$handlers = [];
            }
            if (source === 'handler') {
                if (!local.name) {
                    throw 'Handler name is required.';
                }
                if (!!lodash.get(scope.$handlers, local.name)) {
                    throw 'Handler already exists.';
                }
                lodash.set(scope.$handlers, local.name, local.handler);
            } else {
                var handler = lodash.get(scope.$handlers, source);
                if (!!handler) {
                    return handler(source, local, scope, context);
                }
            }
        }
    });

})();