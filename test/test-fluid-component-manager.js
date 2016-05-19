(function () {
    'use strict';
    var chai = require('chai');
    var expect = chai.expect;
    var FluidComponentManager = require('../src/fluid-component-manager.js');
    var FluidComponent = require('fluid-component');
    var componentManager;
    var core;

    describe('FluidComponentManager basic usage', function () {
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
            var fluidComponent = new FluidComponent();
            fluidComponent.execute({
                name: 'data',
                target: 'core',
                local: {
                    name: 'sample',
                    value: 'The secure way to share data. :)'
                }
            }, componentManager, function (err, data) {
                expect(err).to.be.undefined;
            });
        });
    });

    describe('FluidComponentManager advanced usage with one plugin handler', function () {
        beforeEach(function () {
            componentManager = new FluidComponentManager();
            core = componentManager.get({
                name: 'core2',
                path: '/core-with-plugin-handler/test-core.js',
                dir: __dirname
            });
        });

        it('should be able to use handler from other FluidComponent', function () {
            var coreRunner = componentManager.get({
                name: 'runner',
                path: '/core-with-plugin-handler/test-core-runner.js',
                dir: __dirname
            });
            coreRunner.execute(function (err) {
            }, {
                done: function () {
                    var core2 = componentManager.get('core2');
                    expect(core2.scope.hello).to.be.equal('hello');
                }
            });
        });
    });
    describe('FluidComponentManager advanced usage with multiple plugin handlers', function () {
        beforeEach(function () {
            componentManager = new FluidComponentManager();
            core = componentManager.get({
                name: 'core3',
                path: '/core-with-plugin-handlers/test-core.js',
                dir: __dirname
            });
        });

        it('should be able to use handlers from other FluidComponent', function () {
            var saveProcessor = componentManager.get('save-process');
            saveProcessor.execute(function (err) {
            }, {
                done: function () {
                    var core3 = componentManager.get('core3');
                    expect(core3.scope.saved).to.equal(true);
                }
            });
        });
    });

})();