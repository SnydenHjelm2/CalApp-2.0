import { PubSub } from "../core/store/pubsub.js";
import { EVENTS } from "../core/store/events.js";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
    let options = {
        headers: {"Content-Type": "application/json"},
        method: method.toUpperCase()
    }
    if (body) options.body = JSON.stringify(body);

    try {
        let req = new Request(`http://localhost:8000/${endpoint}`, options);
        PubSub.publish(EVENTS.API.REQUEST.SENT, req);
        let resp = await fetch(req);

        let reso = await resp.json();

        let obj = {
            status: resp.status,
            statusText: resp.statusText,
            body: reso
        }

        if (resp.ok) {
            PubSub.publish(EVENTS.API.RESPONSE.RECEIVED.SUCCESS, obj);
        } else {
            PubSub.publish(EVENTS.API.RESPONSE.RECEIVED.FAILED, obj);
        }

        return obj;
    } catch (e) {
        PubSub.publish(EVENTS.API.REQUEST.NETWORKERROR, e);
        return e.message;
    }
}