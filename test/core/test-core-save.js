(function () {
    'use strict';
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    var ideCoreProcess = fluidComponent.component('event', {
        target: 'core',
        local: {
            name: 'save',
            action: function () {
                var ideCore = ideCoreProcess.componentManager.get('core');
                ideCore.scope.saved = true;
            }
        }
    });

    module.exports = ideCoreProcess;

})();