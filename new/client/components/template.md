# COMPONENT TEMPLATE

> Components in the app should follow this template

```js

class Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        //PubSub subscriptions go in constructor
    }

    connectedCallback() {
        
    }
}

```