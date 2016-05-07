(function () {
    'use strict';

    var FluidComponent = require('fluid-component');
    var fluidComponent = new FluidComponent();
    var SaveEvent = fluidComponent.component('event', {
        target: 'core3',
        local: {
            name: 'save',
            action: function () {
                var core3 = SaveEvent.componentManager.get('core3');
                core3.scope.saved = true;
            }
        }
    });
    module.exports = SaveEvent;

})();