(function () {
    'use strict';
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();

    module.exports = fluidComponent.component('hello-core3', {
        requires: [{
            name: 'event-handler3',
            path: 'test-core-event.handler.js',
            dir: __dirname
        }, {
            name: 'process-handler3',
            path: 'test-core-process.handler.js',
            dir: __dirname
        }, {
            name: 'save-event',
            path: 'test-core-save.event.js',
            dir: __dirname
        }, {
            name: 'save-process',
            path: 'test-core-save.process.js',
            dir: __dirname
        }],
        runs: ['save-event'],
        handler: ['event-handler3', 'process-handler3']
    });

})();