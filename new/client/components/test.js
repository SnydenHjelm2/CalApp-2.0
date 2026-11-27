import { ButtonWithText } from "./button-with-text";

import { PubSub } from "../core/store/pubsub.js";
import { EVENTS } from "../core/store/events.js";
import { apiRequest } from "../services/api.js";

export class Test extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.sub();

        let cssPath = "style.css";

        //Use a separate CSS file, link it in the shadowRoots innerHTML
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../vars.css">
            <link rel="stylesheet" href="/style.css">
        `;

        this.render();
    }

    async create(resource, payload){
        try {
            let data = await apiRequest(resource, "POST", payload);

            PubSub.publish(EVENTS.API.RESPONSE.RECEIVED.SUCCESS, { action: "create", resource, data });

        }
        catch(error){
            PubSub.publish(EVENTS.API.RESPONSE.RECEIVED.FAILED, { action: "create", resource, error: error.message })
        }
        
    }

    render() {
        //Render HTML (via createElement)
        let btn = this.shadowRoot.createElement("div");
        btn.style.padding = "4px";
        btn.style.borderRadius = "4px";
        btn.textContent = this.getAttribute("text");
    }

    sub() {
        //PubSub subscriptions go here, should be called in constructor

    }

    connectedCallback() {
        this.shadowRoot.addEventlistener("click", () => {
            let type = this.getAttribute("type");
            if(type === "create"){
                this.create(this.getAttribute(url), this.getAttribute(payload));
            }

            if(type === "close"){
                //context = "NEW_EVENT" || "EVENT" || "EDIT EVENT" || CAL 
                let context = this.getAttribute("context");

                PubSub.publish(EVENTS.POPUP.CLOSE[context])
            }

            if (type === "open"){
                //context bör se ut exakt som i events.js
                //context = "NEW_EVENT" || "EVENT" || "EDIT_EVENT" || CAL 
                let context = this.getAttribute("context");
                PubSub.publish(EVENTS.POPUP.OPEN[context]);
            }
        });
    }

    disconnectedCallback() {
        
    }

    pubevent() {
        //Publish appropriate event
        PubSub.publish("event::name");
    }
}