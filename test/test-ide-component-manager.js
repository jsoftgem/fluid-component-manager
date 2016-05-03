(function () {
    'use strict';
    var chai = require('chai');
    var expect = chai.expect;
    var IdeComponentManager = require('../src/fluid-component-manager.js');
    var componentManager;
    var path = require('path');
    describe('Ide Component Manager specifications', function () {

        beforeEach(function () {
            componentManager = new IdeComponentManager();
        });
        it('should be defined', function () {
            expect(IdeComponentManager).to.be.defined;
        });
        it('should add module', function () {
            expect(componentManager.addComponentModule('ide-core')).to.be.defined;
        });

        it('should get ide-core component', function () {
            componentManager.addComponentModule({
                name: 'ide-core',
                path: '../test/test-ide-core-component.js'
            });
            componentManager.loadComponents();

            var ideCore = componentManager.get('ide-core');
            expect(ideCore).to.be.defined;
            expect(ideCore.componentManager).to.be.defined;
        });
        it('should set ide-core component properties', function () {
            componentManager.addComponentModule({
                name: 'ide-core',
                path: '../test/test-ide-core-component.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-properties',
                path: '../test/test-ide-core-properties.js'
            });

            componentManager.loadComponents();
            var ideCore = componentManager.get('ide-core');
            expect(ideCore).to.be.defined;
            expect(ideCore.componentManager).to.be.defined;
            var ideCoreProperties = componentManager.get('ide-core-properties');
            expect(ideCoreProperties).to.be.defined;
            expect(ideCoreProperties.componentManager).to.be.defined;
            ideCoreProperties.execute(function (err) {
                console.log(err);
            });
            setTimeout(function () {
                expect(ideCore.scope.version).to.be.equal('0.1.0');
            }, 1000);
        });
        it('should set ide-core component event', function () {
            componentManager.addComponentModule({
                name: 'ide-core',
                path: '../test/test-ide-core-component.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-properties',
                path: '../test/test-ide-core-properties.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-event',
                path: '../test/test-ide-core-event.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-process',
                path: '../test/test-ide-core-process.js'
            });

            componentManager.loadComponents(function (err) {
                console.log(err);
            });

            var ideCore = componentManager.get('ide-core');
            expect(ideCore).to.be.defined;
            expect(ideCore.componentManager).to.be.defined;

            var ideCoreProperties = componentManager.get('ide-core-properties');
            expect(ideCoreProperties).to.be.defined;
            expect(ideCoreProperties.componentManager).to.be.defined;
            ideCoreProperties.execute(function (err) {
                console.log(err);
            });

            var ideCoreEvent = componentManager.get('ide-core-event');
            expect(ideCoreEvent).to.be.defined;
            expect(ideCoreEvent.componentManager).to.be.defined;
            ideCoreEvent.execute(function (err) {
                console.log(err);
            });

            var ideCoreProcess = componentManager.get('ide-core-process');
            expect(ideCoreProcess).to.be.defined;
            expect(ideCoreProcess.componentManager).to.be.defined;
            ideCoreProcess.execute(function (err) {
                console.log(err);
            });

            setTimeout(function () {
                expect(ideCore.scope.saved).to.equal(true);
            }, 1000);
        });
        it('should unset direct component assignment', function () {
            componentManager.addComponentModule({
                name: 'ide-core',
                path: '../test/test-ide-core-component.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-properties',
                path: '../test/test-ide-core-properties.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-event',
                path: '../test/test-ide-core-event.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-process',
                path: '../test/test-ide-core-process.js'
            });

            componentManager.loadComponents();

            var ideCore = componentManager.get('ide-core');
            ideCore.hello = 'hello';
            expect(ideCore).to.be.defined;
            expect(ideCore.componentManager).to.be.defined;
            ideCore = componentManager.get('ide-core');
            expect(ideCore.hello).to.be.undefined;
        });

        it('should set ide-core component interceptor', function () {
            componentManager.addComponentModule({
                name: 'ide-core',
                path: '../test/test-ide-core-component.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-properties',
                path: '../test/test-ide-core-properties.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-event',
                path: '../test/test-ide-core-event.js'
            });

            componentManager.addComponentModule({
                name: 'ide-core-process',
                path: 'test-ide-core-process.js',
                dir: __dirname
            });

            componentManager.addComponentModule({
                name: 'ide-core-interceptor',
                path: '../test/test-ide-core-interceptor.js'
            });

            componentManager.loadComponents();

            var ideCore = componentManager.get('ide-core');
            expect(ideCore).to.be.defined;
            expect(ideCore.componentManager).to.be.defined;

            var ideCoreInterceptor = componentManager.get('ide-core-interceptor');
            expect(ideCoreInterceptor).to.be.defined;
            expect(ideCoreInterceptor.componentManager).to.be.defined;
            ideCoreInterceptor.execute();

            var ideCoreProperties = componentManager.get('ide-core-properties');
            expect(ideCoreProperties).to.be.defined;
            expect(ideCoreProperties.componentManager).to.be.defined;
            ideCoreProperties.execute();

            var ideCoreEvent = componentManager.get('ide-core-event');
            expect(ideCoreEvent).to.be.defined;
            expect(ideCoreEvent.componentManager).to.be.defined;
            ideCoreEvent.execute();

            setTimeout(function () {
                expect(ideCore.scope.saved).to.equal(true);
            }, 1000);

        });
    });

})();