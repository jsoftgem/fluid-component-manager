(function () {
    'use strict';

    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    module.exports = fluidComponent.component('process', {
        target: 'core3',
        handler: function (source, local, scope) {
            if (!scope.__$events) {
                throw 'No events found for ' + source;
            }
            if (!local.event) {
                throw 'Event is required.';
            }
            scope.__$events.emit(local.event, source);
        }
    });

})();