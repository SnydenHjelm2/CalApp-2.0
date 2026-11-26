import { EVENTS } from "../../../core/store/events.js";
import { Pubsub } from "../../../core/store/pubsub.js";
import { ICONS } from "./icons.js";


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
                <link rel="stylesheet" href="../vars.css">
                <link rel="stylesheet" href="/Nav.css">
                
                <nav>
                    ${Object.entries(EVENTS.VIEW).map(([key, eventName]) => `
                        <button data-event="${eventName}">${ICONS[key]}</button>
                    `).join("")}
                </nav>
            `;
    }

    sub() {
        Object.values(EVENTS.VIEW).forEach((eventName) => {
            Pubsub.subscribe(eventName, () => {
                this.setActiveButton(eventName);
            })
        })
    }
    pubevent(eventName, data = null) {
        Pubsub.publish(eventName, data, true); // "view::home" etc
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
        this.shadowRoot.removeEventListener("click", this.onclick);
    }


}

customElements.define("bottom-nav", BottomNav)