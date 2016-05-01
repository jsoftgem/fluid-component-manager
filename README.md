# fluid-component-manager

  Manages and loads fluid-component/s to application.

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
