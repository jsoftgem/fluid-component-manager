(function () {
    'use strict';
    var lodash = require('lodash');
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    module.exports = fluidComponent.component('handler', {
        target: 'core',
        local: {
            name: 'data',
            handler: function (source, local, scope) {
                lodash.set(scope, local.name, local.value);
                console.log('local', local);
                console.log('core.scope', scope);
                return lodash.get(scope, local.name);
            }
        }
    });

})();