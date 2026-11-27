//Import PubSub and components needed
import { component } from "../component/component.js";
import { PubSub } from "../store/pubsub.js";
import { store } from "../store/store.js";

export class homeView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.sub();

        //Optional if needed
        this.data = store.getState();

        //Use a separate CSS file, link it in the shadowRoots innerHTML
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../vars.css">
            <link rel="stylesheet" href="/style.css">
        `;

        this.render();
    }

    render() {
        //Render HTML (via createElement)
        let main = document.createElement("main");
        main.innerHTML = `
        <div><p>Filter placeholder</p></div>
        <form>
            <input type="search" placeholder="search"></input>
        </form>
        <div id="list">
            <h1>Today</h1>
            <div><p>Event1</p></div>
            <h1>Tomorrow</h1>
            <div><p>Event2</p></div>
            <h1>Upcoming</h1>
            <div><p>Event3</p></div>
            <div><p>Event4</p></div>
        </div>
        <p>Load 5 more</p>
        `

        document.body.appendChild(main);
    }

    sub() {
        //PubSub subscriptions go here, should be called in constructor
        PubSub.subscribe("change:view", (data) => {
            if (data.url === "/home") {
                this.render();
            }
        })

        PubSub.subscribe("change:page", (data) => {
            if (data.page === "home") {
                this.render();
            }
        })
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

customElements.define("home-view", homeView);