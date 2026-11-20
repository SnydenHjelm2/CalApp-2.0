
import { state } from "./state.js";

class Store {

    static allStates = [];
    static allListeners = {};

    constructor(initialState) {
        this._state = initialState;
        this.lastState = null;
        Store.allStates.push(this._state)
    }

    getState() {
        return structuredClone(this._state);
    }


    // Expects: {key1: callback1, key2: callback2...}, supports multiple keys
    setState(newState, consoleLogIt = false) {
        // Reject invalid format
        if (typeof newState !== "object" || Array.isArray(newState)) {
            return false;
        }

        if (consoleLogIt) {
            console.log("New store setState: ", newState);
        }

        this.lastState = this.getState();

        for (let key in newState) {
            if (!this._state[key]) {
                delete newState[key];
                continue;
            }

            if (key === "user") {
                newState[key] = {...this._state[key], ...newState[key]};
                continue;
            }

            newState[key] = [...this._state[key], ...newState[key]];
        }
        this._state = Object.assign(this._state, newState);

        // Notify about state change per key
        for (let keyName in newState) {
            this.notify(keyName, newState[keyName]);
        }

        if (consoleLogIt) {
            console.log("Old state: ", this.lastState);
            console.log("New state: ", this.getState());
        }

        return true;
    }

    set state(value) {
        throw new Error("Not allowed");
    }

    subscribe(keyName, listener, consoleLogIt = false) {

        if (consoleLogIt) {
            console.log("New store subscribe: ", keyName, " with listener: ", listener);
        }
        
        if (!Store.allListeners[keyName]) {

            Store.allListeners[keyName] = []

        };

        Store.allListeners[keyName].push(listener);
    }

    notify(keyName, data, consoleLogIt = false) {

        if (consoleLogIt) {
            console.log("New store notify: ", keyName, " with data: ", data);
        }
        
        if (!Store.allListeners[keyName]) {

            return "No listeners for event"

        } else {

            Store.allListeners[keyName].forEach(listener => listener(data));
        }
    }


    // Reset state.js (if user logs ut etc)
    resetState(consoleLogIt = false) {

        if (consoleLogIt) {
            console.log("New store resetState");
        }
        
        this._state = structuredClone(state);

        // Notify about state change per key
        for (let keyName in this._state) {
            this.notify(keyName, this._state[keyName]);
        }

    }

}

export const store = new Store(state);