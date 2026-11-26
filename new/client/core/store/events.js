export const EVENTS = {
    API: {
        REQUEST: {
            SENT: "api::request::sent",
            NETWORKERROR: "api::request::networkerror"
        },

        RESPONSE: {
            RECEIVED: {
                SUCCESS: "api::response::received::success",
                FAILED: "api::response::received::failed"
            }
        }
    }
}