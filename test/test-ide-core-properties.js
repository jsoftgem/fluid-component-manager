(function () {
    'use strict';
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    module.exports = fluidComponent.component('properties', {
        target: 'ide-core',
        local: {
            version: '0.1.0'
        }
    })
})();