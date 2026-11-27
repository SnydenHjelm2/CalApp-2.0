
//Import PubSub and components needed
import { EVENTS } from "../../core/store/events.js";
import { PubSub } from "../../core/store/pubsub.js";
import { store } from "../../core/store/store.js";


/* 
    activeView hämtas från attributet på komponenten,
    VIEW komponenten som visas måste ha <filter-bar> komponenten
    i sin innerHTML. Se även connectedCallBack
*/


export class FilterBar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });


        this.currentViewComponentTag = null;
        this.filters = {};
        this.data = store.getState();
    }

    render() {
        this
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/components/FilterBar/FilterBar.css">

                ${Object.entries(this.filters).map(([key, eventName], index) => `
                    <button data-event="${eventName}" class="${index === 0 ? "active" : ""}">
                        ${key.toLocaleLowerCase()}
                    </button>
                `).join("")}
        `;

    }

    connectedCallback() {
        const activeView = this.getAttribute("filterGroup"); // Ex: SEARCH, filterGroup="SEARCH"
        console.log(activeView);
        this.setAttribute("class", "filter-bar");

        this.filters = EVENTS.FILTER[activeView];
        this.render();
        this.sub();

        this.shadowRoot.addEventListener("click", this.onClick);

        const firstEvent = Object.values(this.filters)[0];
        if (firstEvent) {
            this.pubevent(firstEvent);
        }
    }
    disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.onClick);

    }


    sub() {
        for (const [key, eventName] of Object.entries(this.filters)) {
            PubSub.subscribe(eventName, () => this.setActiveButton(eventName));
        }

        //LOGIN
        PubSub.subscribe(EVENTS.AUTH.LOGIN.SUCCESS, () => {
            this.pubevent(EVENTS.VIEW.HOME);
        });
    }




    onClick = (event) => {
        const button = event.target.closest("button[data-event]");
        if (!button) return;

        console.log("TRYCKT FILTER: " + button.dataset.event);

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


