(function () {
    'use strict';

    var lodash = require('lodash');
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();

    module.exports = fluidComponent.component('hello-core2', {
        requires: [{
            name: 'plugin-handler',
            path: 'test-core-plugin.handler.js',
            dir: __dirname
        }],
        handler: 'plugin-handler'
    });

})();