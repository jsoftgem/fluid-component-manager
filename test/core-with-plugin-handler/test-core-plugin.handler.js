(function () {
    'use strict';

    var lodash = require('lodash');
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();

    module.exports = fluidComponent.component('handler', {
        target: 'core2',
        handler: function (source, local, scope) {
            scope.isPluggedIn = true;
            scope.hello = local.sample;
        }
    });

})();