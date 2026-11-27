import { EVENTS } from "../../../core/store/events.js";
import { PubSub } from "../../../core/store/pubsub.js";
import { store } from "../../../core/store/store.js";
import { ICONS } from "../icons.js";


export class BottomNav extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });


        this.data = store.getState();
        this.render();
        this.sub();
    }

    render() {
        this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="views/app/nav/BottomNav.css">
                
                ${Object.entries(EVENTS.VIEW).map(([key, eventName], index) => `
                    <button data-event="${eventName}" class="${index === 0 ? "active" : ""}">
                        ${ICONS[key]}
                        </button>
                `).join("")}
            `;
    }

    sub() {
        Object.values(EVENTS.VIEW).forEach((eventName) => {
            PubSub.subscribe(eventName, () => {
                this.setActiveButton(eventName);
            })
        })
    }
    pubevent(eventName, data = null) {
        PubSub.publish(eventName, data, true); // "view::home" etc
    }

    connectedCallback() {
        this.shadowRoot.addEventListener("click", this.onclick);
    }

    onclick = (event) => {
        const button = event.target.closest("button[data-event]");
        if (!button) return;

        this.pubevent(button.dataset.event);
    }

    //MARKERAR KNAPP SOM ÄR TRYCKT
    setActiveButton(activeEventName) {
        const buttons = this.shadowRoot.querySelectorAll("button[data-event]");
        
        for (const butt of buttons) {
            const isActive = butt.dataset.event === activeEventName;
            butt.classList.toggle("active", isActive);
        }
    }

    disconnectedCallback() {
    }

}

customElements.define("bottom-nav", BottomNav)