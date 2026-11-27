
import { EVENTS } from "../../../core/store/events.js";
import { PubSub } from "../../../core/store/pubsub.js";
import { store } from "../../../core/store/store.js";


export class TopBar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.data = store.getState();
        this.render();
    }

    render() {
        const logoPath = "views/app/Top/logo_weSYNC.png";
        this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="views/app/Top/TopBar.css">
                
                <section>
                    <img src="${logoPath}">
                </section>
            `;
    }
}

customElements.define("top-bar", TopBar)