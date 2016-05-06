(function () {
    'use strict';

    var lodash = require('lodash');
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();

    module.exports = fluidComponent.component('handler', {
        target: 'core',
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