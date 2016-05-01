(function () {
    'use strict';

    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    module.exports = fluidComponent.component('handler', {
        target: 'core',
        local: {
            name: 'process',
            handler: function (source, local, scope, context) {
                if (!local.event) {
                    throw 'Specifiy an event for this process';
                }
                if (!scope._coreEvent) {
                    throw 'No existing event for component core.';
                }
                scope._coreEvent.emit(local.event);
            }
        }
    });

})();