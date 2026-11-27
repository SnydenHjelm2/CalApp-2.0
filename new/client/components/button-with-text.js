import { PubSub } from "../core/store/pubsub.js";
import { EVENTS } from "../core/store/events.js";
import { apiRequest } from "../services/api.js";

export class ButtonWithText extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.sub();

        //Use a separate CSS file, link it in the shadowRoots innerHTML
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="assets/style.css">


        `;

        this.render();
    }

    async create(resource, payload){
        try {
            let data = await apiRequest(resource, "POST", payload);
            PubSub.publish(EVENTS.API.RESPONSE.RECEIVED.SUCCESS, { action: "create", resource, data }, true);

        }
        catch(error){
            PubSub.publish(EVENTS.API.RESPONSE.RECEIVED.FAILED, { action: "create", resource, error: error.message }, true)
        }
        
    }

    render() {
        //Render HTML (via createElement)
        let btn = document.createElement("button");
        btn.textContent = this.getAttribute("text").toLocaleUpperCase();
        btn.classList.add("btn-with-text");
        this.shadowRoot.appendChild(btn);
    }

    sub() {
        //PubSub subscriptions go here, should be called in constructor

    }

    connectedCallback() {

        this.shadowRoot.addEventListener("click", () => {
            let action = this.dataset.action;
    
            if(action === "create"){
                this.create(this.getAttribute("url"), this.getAttribute("payload"));
            }

            if(action === "close"){
                //context = "NEW_EVENT" || "EVENT" || "EDIT EVENT" || CAL 
                let event = this.dataset.event;
                console.log(event);

                PubSub.publish(event,{}, true)
            }

            if (action === "open"){
                let event = this.dataset.event;
                PubSub.publish(event, {}, true);
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
customElements.define("button-with-text", ButtonWithText);

//Exempel på användning:
//<button-with-text context="NEW_EVENT" text="close" data-action="close" data-event="popup::close::event"></button-with-text>

