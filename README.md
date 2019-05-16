[![npm version](https://badge.fury.io/js/%40netsells%2Fvue-dom-listeners.svg)](https://badge.fury.io/js/%40netsells%2Fvue-dom-listeners)
[![Build Status](https://travis-ci.com/netsells/vue-dom-listeners.svg?branch=master)](https://travis-ci.com/netsells/vue-dom-listeners)
[![codecov](https://codecov.io/gh/netsells/vue-dom-listeners/branch/master/graph/badge.svg)](https://codecov.io/gh/netsells/vue-dom-listeners)

# Vue DOM Listeners

Handle DOM events outside the current component without worrying about memory
leaks. When the component is destroyed, the mixin will automatically remove the
event listeners from the targets.

## Installation
```
yarn add @netsells/vue-dom-listeners
```

## Usage

This mixin adds addEventListener and removeEventListener methods to the
component. These take the same arguments as the standard functions, except the
first argument should be the event target, e.g.:

`document.addEventListener(...args)` -> `this.addEventListener(document, ...args)`

### Example

```javascript
import DomListeners from '@netsells/vue-dom-listeners';

export default {
    mixins: [DomListeners],

    mounted() {
        this.addEventListener(document, 'click', (e) => {
            // on clicking anywhere in document
        });
    },
};
```
