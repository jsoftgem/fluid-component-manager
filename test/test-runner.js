(function () {
    'use strict';
    var chai = require('chai');
    var expect = chai.expect;
    var FluidComponentManager = require('../src/fluid-component-manager.js');
    var componentManager;


    describe('Core runner', function () {
        beforeEach(function () {
            componentManager = new FluidComponentManager();
        });
        it('should add handlers', function () {

            componentManager.addComponentModule({
                name: 'core',
                path: '../test/test-core.js'
            });
            componentManager.addComponentModule({
                name: 'process-handler',
                path: '../test/test-core-process.handler.js'
            });

            componentManager.addComponentModule({
                name: 'event-handler',
                path: '../test/test-core-event.handler.js'
            });

            componentManager.addComponentModule({
                name: 'event-save',
                path: '../test/test-core-save.js'
            });

            componentManager.addComponentModule({
                name: 'process-save',
                path: '../test/test-core-process.js'
            });

            componentManager.loadComponents(function (err) {
                console.error(err);
            });

            var core = componentManager.get('core');
            var processHandler = componentManager.get('process-handler');
            var eventHandler = componentManager.get('event-handler');
            var eventSave = componentManager.get('event-save');
            var processSave = componentManager.get('process-save');


            processHandler.execute(function (err) {
                console.error(err)
            });
            eventHandler.execute(function (err) {
                console.error(err)
            });

            setTimeout(function () {
                eventSave.execute(function (err) {
                    console.error(err)
                });
            }, 3000);
            setTimeout(function () {
                processSave.execute(function (err) {
                    console.error(err)
                });
            }, 3000);

            setTimeout(function () {
                console.log(core.scope);
            }, 5000);

        });
    });

})();