
//Import PubSub and components needed
import { EVENTS } from "../../core/store/events.js";
import { PubSub } from "../../core/store/pubsub.js";
import { store } from "../../core/store/store.js";

const VIEW_COMPONENT_TAGS = {
    [EVENTS.VIEW.HOME]: "home-view",
    [EVENTS.VIEW.CALS]: "cals-view",
    [EVENTS.VIEW.SEARCH]: "search-view",
    [EVENTS.VIEW.CHAT]: "messages-view",
    [EVENTS.VIEW.PROFILE]: "profile-view"
}

export class AppRoot extends HTMLElement {

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

                <top-bar></top-bar>
                <main id="content">
                    <filter-bar filterGroup="HOME"></filter-bar>
                </main>
                <bottom-nav></bottom-nav>
        `;

        this.content = this.shadowRoot.querySelector("#content");
    }

    sub() {
        // PRENUMERERAR FÖR VARJE VIEW (se lista ^)
        for (const [eventName, componentTag] of Object.entries(VIEW_COMPONENT_TAGS)) {
            PubSub.subscribe(eventName, () => this.renderContentView(componentTag));
        }

        //LOGIN
        PubSub.subscribe(EVENTS.AUTH.LOGIN.SUCCESS, () => { // LYSSNAR PÅ OM LOGIN SUCESS
            this.pubevent(EVENTS.VIEW.HOME);
        });
    }


    connectedCallback() {
        this.sub();
    }

    disconnectedCallback() {

    }

    pubevent(eventName, data = null) {
        PubSub.publish(eventName, data, true); // VISA HOME!
    }


    renderContentView(viewComponentTag) {
        if (viewComponentTag == this.currentViewComponentTag) return;

        this.currentViewComponentTag = viewComponentTag;
        this.content.replaceChildren(document.createElement(viewComponentTag));
        this.content.scrollTop = 0;
    }

}
customElements.define("app-root", AppRoot)


