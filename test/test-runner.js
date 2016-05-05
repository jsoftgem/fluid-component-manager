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

            var core = componentManager.get({
                name: 'core',
                path: '../test/test-core.js'
            });

            setTimeout(function () {
                console.log(core);
            }, 5000);

        });
    });

})();