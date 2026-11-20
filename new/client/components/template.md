# COMPONENT TEMPLATE

> Components in the app should follow this template

```js
//Import PubSub and components needed
import { component } from "../component/component.js";
import { PubSub } from "../store/pubsub.js";
import { store } from "../store/store.js";


class Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.sub();

        //Optional if needed
        this.data = store.getState();

        let cssPath = "style.css";

        //Use a separate CSS file, link it in the shadowRoots innerHTML
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../vars.css">
            <link rel="stylesheet" href="/style.css">
        `;

        this.render();
    }

    render() {
        //Render HTML (via createElement)
    }

    sub() {
        //PubSub subscriptions go here, should be called in constructor
    }

    connectedCallback() {
        this.shadowRoot.addEventlistener("click", () => {
            let type = this.getAttribute("type");
            if (type === "create") this.create();
        });
    }

    disconnectedCallback() {
        
    }

    pubevent() {
        //Publish appropriate event
        PubSub.publish("event::name");
    }
}
```