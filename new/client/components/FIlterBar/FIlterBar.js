
//Import PubSub and components needed
import { EVENTS } from "../../core/store/events.js";
import { PubSub } from "../../core/store/pubsub.js";
import { store } from "../../core/store/store.js";


/* 
    activeView hämtas från attributet på komponenten,
    VIEW komponenten som visas måste ha <filter-bar> komponenten
    i sin innerHTML. Se även connectedCallBack
*/
const filters = EVENTS.FILTER[activeView];


export class FilterBar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });


        this.currentViewComponentTag = null;
        this.data = store.getState();
        this.render();
    }

    render() {

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="views/app/app.css">

            <div class="filter-bar">
                ${Object.entries(filters).map(([key, eventName]) => `
                    <button data-event="${eventName}">
                        ${key.toLocaleLowerCase}
                    </button>
                    `).join("")}
            </div>
            
        `;
    }

    sub() {
        for (const [eventName, filter] of Object.entries(filters)) {
            PubSub.subscribe(eventName, () => this.setActiveButton(eventName));
        }

        //LOGIN
        PubSub.subscribe(EVENTS.AUTH.LOGIN.SUCCESS, () => {
            this.pubevent(EVENTS.VIEW.HOME);
        });
    }

    connectedCallback() {
        this.sub();
        activeView = this.getAttribute("filterGroup"); // Ex: SEARCH, filterGroup="SEARCH"
    }

    disconnectedCallback() { }

    onClock = (event) => {
        const button = event.target.closest("button[data-event]");
        if (!button) return;

        console.log("TRYCKT FILTER: " + this.dataset.event);

        this.pubevent(button.dataset.event); // filter::x::x // filter::home::upcoming
    }

    pubevent(eventName, data = null) {
        PubSub.publish(eventName, data, true); // FILTRERA RESULTAT
    }

    setActiveButton(activeEventName) {
        const buttons = this.shadowRoot.querySelectorAll("button[data-event]");

        for (const butt of buttons) {
            const isActive = butt.dataset.event === activeEventName;
            butt.classList.toggle("active", isActive);
        }
    }
}
customElements.define("filter-bar", FilterBar)


