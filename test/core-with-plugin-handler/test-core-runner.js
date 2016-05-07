(function () {
    'use strict';
    
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();

    module.exports = fluidComponent.component('event', {
        target: 'core2',
        local: {
            sample: 'hello'
        }
    });

})();