(function () {
    'use strict';
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    module.exports = fluidComponent.component('process', {
        target: 'ide-core',
        local: {
            event: 'save'
        }
    });

})();