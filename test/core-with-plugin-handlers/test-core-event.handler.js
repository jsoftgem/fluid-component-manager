(function () {
    'use strict';

    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    var EventEmitter = require('events').EventEmitter;
    module.exports = fluidComponent.component('event', {
        target: 'core3',
        handler: function (source, local, scope) {
            if (!scope.__$events) {
                scope.__$events = new EventEmitter;
            }
            if (!local.name) {
                throw 'Event name is required.';
            }
            if (!local.action) {
                throw 'Event action is required.';
            }
            scope.__$events.on(local.name, local.action);
        }
    });

})();