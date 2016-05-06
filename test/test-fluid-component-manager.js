(function () {
    'use strict';
    var chai = require('chai');
    var expect = chai.expect;
    var FluidComponentManager = require('../src/fluid-component-manager.js');
    var componentManager;
    var core;

    describe('Core runner', function () {
        beforeEach(function () {
            componentManager = new FluidComponentManager();
            core = componentManager.get({
                name: 'core',
                path: '/core/test-core.js',
                dir: __dirname
            });
        });
        it('should get defined component with componentManager.get', function () {
            var storedCore = componentManager.get('core');
            expect(storedCore).to.be.defined;
        });

        it('should reset component when componentManager.get is called', function () {
            core.bad = 'bad way to assign data';
            var newCore = componentManager.get('core');
            expect(newCore.bad).to.not.defined;
        });
        
        it('should maintain scope data of component even when componentManager.get is called', function () {
            core.scope.good = 'good way to share data';
            var newCore = componentManager.get('core');
            expect(newCore.scope.good).to.be.defined;
        });


    });

})();