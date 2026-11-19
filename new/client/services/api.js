import { PubSub } from "../core/store/pubsub.js";

export const apiRequest = async (endpoint, method, body = null) => {
    let options = {
        headers: {"Content-Type": "application/json"},
        method: method.toUpperCase()
    }
    if (body) options.body = JSON.stringify(body);

    try {
        let req = new Request(`http://localhost:8000/${endpoint}`, options);
        let resp = await fetch(req);

        //PubSub.publish("request::sent");

        if (resp.ok) {
            //PubSub.publish("response::received::success");
            return {
                success: true,
                resource: await resp.json()
            }
        } else {
            //PubSub.publish("response::received::failed");
            return {
                success: false,
                resource: await resp.json()
            }
        }
    } catch (e) {
        //PubSub.publish("request::networkerror");
        return e.message;
    }
}