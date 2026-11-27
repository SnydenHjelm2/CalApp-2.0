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
        PubSub.subscribe(EVENTS.API.RESPONSE.RECEIVED.SUCCESS, (data) => {
            if (data.action === "register") {
                PubSub.publish(EVENTS.AUTH.REGISTER.SUCCESS, data);
            } else if (data.action === "login") {
                //set store / get user info here?
                PubSub.publish(EVENTS.AUTH.LOGIN.SUCCESS, data);
                //or sub on this event and do it there?
            }
        });
        PubSub.subscribe(EVENTS.API.RESPONSE.RECEIVED.FAILED, (data) => {
            if (data.action === "register") {
                PubSub.publish(EVENTS.AUTH.REGISTER.FAILED, data);
            } else if (data.action === "login") {
                PubSub.publish(EVENTS.AUTH.LOGIN.FAILED, data);
            }
        });
        PubSub.subscribe(EVENTS.AUTH.REGISTER.START, async (data) => {
            PubSub.publish(EVENTS.AUTH.REGISTER.PENDING);
            await apiRequest("register", "users", "POST", data);
        });
        PubSub.subscribe(EVENTS.AUTH.REGISTER.PENDING, () => {
            this.shadowRoot.querySelector(".lr-status").textContent = "Please wait...";
        });
        PubSub.subscribe(EVENTS.AUTH.REGISTER.SUCCESS, (data) => {
            this.shadowRoot.querySelector(".lr-status").textContent = "Register successfull!";
            console.log(data);
            //möjlig setTimeout som re-directar till login?
        });
        PubSub.subscribe(EVENTS.AUTH.REGISTER.FAILED, (data) => {
            this.shadowRoot.querySelector(".lr-status").textContent = `Error: ${data.body.error}`;
            console.log(data);
        });
        PubSub.subscribe(EVENTS.AUTH.LOGIN.START, async (data) => {
            PubSub.publish(EVENTS.AUTH.LOGIN.PENDING);
            await apiRequest("login", `users?email=${data.email}&pwd=${data.pwd}`);
        });
        PubSub.subscribe(EVENTS.AUTH.LOGIN.SUCCESS, (data) => {
            this.shadowRoot.querySelector(".lr-status").textContent = "Success!";
            console.log(data);
        });
        PubSub.subscribe(EVENTS.AUTH.LOGIN.FAILED, (data) => {
            this.shadowRoot.querySelector(".lr-status").textContent = `Error: ${data.body.error}`;
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
            this.shadowRoot.querySelector(".lr-switch").addEventListener("click", () => {
                PubSub.publish(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.LOGIN, "login");
            });
            this.shadowRoot.querySelector("#lr-register").addEventListener("click", () => {
                let name = this.shadowRoot.querySelector("#lr-name").value;
                let email = this.shadowRoot.querySelector("#lr-email").value;
                let pwd = this.shadowRoot.querySelector("#lr-password").value;

                PubSub.publish(EVENTS.AUTH.REGISTER.START, {
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
            this.shadowRoot.querySelector(".lr-switch").addEventListener("click", () => {
                PubSub.publish(EVENTS.COMPONENT.LOGIN_REGISTER.NAVIGATE.REGISTER, "register");
            });
            this.shadowRoot.querySelector("#lr-login").addEventListener("click", () => {
                let email = this.shadowRoot.querySelector("#lr-email").value;
                let pwd = this.shadowRoot.querySelector("#lr-password").value;

                PubSub.publish(EVENTS.AUTH.LOGIN.START, {
                    email: email,
                    pwd: pwd
                });
            });
        } 
    }
}

customElements.define("login-register", LoginRegister);