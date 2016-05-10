# fluid-component-manager

  Manages and loads [fluid-component/s](https://github.com/jsoftgem/fluid-component) to application.

[![NPM](https://nodei.co/npm/fluid-component-manager.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fluid-component-manager?downloads=true&downloadRank=true&stars=true)

# Installation
` npm install fluid-component-manager --save`

# Getting started
``` 
var FluidComponentManager = require('fluid-component-manager');
var fluidComponentManager = new FluidComponentManager();
    componentManager.addComponentModule({
            name: 'fluidComponentSample',
            path: 'fluid-component-sample'
    });
fluidComponentManager.loadComponents();
```
