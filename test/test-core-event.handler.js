(function () {
    'use strict';

    var lodash = require('lodash');
    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    const EventEmitter = require('events');
    const event = new EventEmitter();

    module.exports = fluidComponent.component('handler', {
        target: 'core',
        local: {
            name: 'event',
            handler: function (source, local, scope, context) {
                if (!scope.event) {
                    scope.event = event;
                }

                if (local.name) {
                    if (!local.action) {
                        throw 'Event action is required (action:Function).';
                    }
                    scope.event.on(local.name, local.action);
                }
            }
        }
    });

})();