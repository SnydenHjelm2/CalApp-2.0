import { EVENTS } from "../../core/store/events.js";
import { PubSub } from "../../core/store/pubsub.js";
import { store } from "../../core/store/store.js";
import { apiRequest } from "../../services/api.js";

export class LoginRegister extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.sub();

        this.render(this.getAttribute("version"));
    }

    sub() {
        PubSub.subscribe(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.LOGIN, (data) => {this.render(data)});
        PubSub.subscribe(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.REGISTER, (data) => {this.render(data)});
        PubSub.subscribe(EVENTS.API.REQUEST.SENT, () => {
            this.shadowRoot.querySelector(".lr-status").textContent = "Please wait...";
        });
        PubSub.subscribe(EVENTS.API.REQUEST.NETWORK_ERROR, (data) => {
            this.shadowRoot.querySelector(".lr-status").textContent = "Something went wrong: " + data.message;
        });
        PubSub.subscribe(EVENTS.API.RESPONSE.RECEIVED.SUCCESS, (data) => {
            if (data.method === "GET") {
                //handle log-in success
            } else if (data.method === "POST") {
                //handle register success
            }
        });
        PubSub.subscribe(EVENTS.API.RESPONSE.RECEIVED.FAILED, (data) => {
            this.shadowRoot.querySelector(".lr-status").textContent = "Error: " + data.body.error;
            console.log(data);
        });
    }

    render(version) {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="views/login-register/login-register.css">
            <h1>weSYNC</h1>
        `;
        if (!version) {
            this.shadowRoot.innerHTML += `
                <p>Welcome to weSYNC!</p>
                <button id="lr-register-nav">Register</button>
                <button id="lr-login-nav">Log In</button>
            `;
            this.shadowRoot.querySelector("#lr-register-nav").addEventListener("click", () => {
                PubSub.publish(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.REGISTER, "register");
            });
            this.shadowRoot.querySelector("#lr-login-nav").addEventListener("click", () => {
                PubSub.publish(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.LOGIN, "login");
            });
        } else if (version === "register") {
            this.shadowRoot.innerHTML += `
                <p>Enter the fields to register</p>
                <input id="lr-name" type="text" placeholder="Name...">
                <input id="lr-email" type="text" placeholder="Email...">
                <input id="lr-password" type="password" placeholder="Password...">
                <button id="lr-register">Register</button>
                <p class="lr-status"></p>
                <p class="lr-switch">Already have an account? Log in here!</p>
            `;
            this.shadowRoot.querySelector(".switch").addEventListener("click", () => {
                PubSub.publish(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.LOGIN, "login");
            });
            this.shadowRoot.querySelector("#lr-register").addEventListener("click", async () => {
                let name = this.shadowRoot.querySelector("#lr-name").value;
                let email = this.shadowRoot.querySelector("#lr-email").value;
                let pwd = this.shadowRoot.querySelector("#lr-password").value;

                await apiRequest("users", "POST", {
                    name: name,
                    email: email,
                    pwd: pwd
                });
            });
        } else if (version === "login") {
            this.shadowRoot.innerHTML += `
                <p>Please enter your credentials to log in</p>
                <input id="lr-email" type="text" placeholder="Email...">
                <input id="lr-password" type="password" placeholder="Password...">
                <button id="lr-login">Log in</button>
                <p class="lr-status"></p>
                <p class="lr-switch">Don't have an account? Register today!</p>
            `;
            this.shadowRoot.querySelector(".switch").addEventListener("click", () => {
                PubSub.publish(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.REGISTER, "register");
            });
            this.shadowRoot.querySelector("#lr-login").addEventListener("click", async () => {
                let email = this.shadowRoot.querySelector("#lr-email").value;
                let pwd = this.shadowRoot.querySelector("#lr-password").value;

                await apiRequest(`users?email=${email}&pwd=${pwd}`, "GET");
            });
        } 
    }
}

customElements.define("login-register", LoginRegister);