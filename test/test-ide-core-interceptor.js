(function () {
    'use strict';
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    var ideCoreProcess = fluidComponent.component('interceptor', {
        target: 'ide-core',
        local: {
            target: 'properties',
            action: 'ide-core-process'
        }
    });

    module.exports = ideCoreProcess;

})();