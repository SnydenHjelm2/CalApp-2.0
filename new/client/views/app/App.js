
//Import PubSub and components needed
import { EVENTS } from "../../core/store/events.js";
import { component } from "../component/component.js";
import { PubSub } from "../store/pubsub.js";
import { store } from "../store/store.js";


const VIEW_COMPONENT_TAGS = {
    [EVENTS.VIEW.HOME]: "home-view",,
    [EVENTS.VIEW.CALS]: "cals-view",
    [EVENTS.VIEW.SEARCH]: "search-view",
    [EVENTS.VIEW.CHAT]: "messages-view",
    [EVENTS.VIEW.PROFILE]: "profile-view"
}

export class App extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });


        this.currentViewComponentTag = null;
        this.data = store.getState();
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../vars.css">
            <link rel="stylesheet" href="/app.css">

            <top-bar></top-bar>
            <main id="content"></main>
            <bottom-nav></bottom-nav>
        `;

        this.content = this.shadowRoot.querySelector("#content");
    }

    sub() {

        for (const [eventName, componentTag] of Object.entries(VIEW_COMPONENT_TAGS)) {
            PubSub.subscribe(eventName, () => this.showView(componentTag));
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

customElements.define("app-root", App)


