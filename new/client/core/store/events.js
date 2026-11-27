export const EVENTS = {
    API: {
        REQUEST: {
            SENT: "api::request::sent",
            NETWORK_ERROR: "api::request::networkerror"
        },

        RESPONSE: {
            RECEIVED: {
                SUCCESS: "api::response::received::success",
                FAILED: "api::response::received::failed"
            }
        }
    },
    VIEW: {
        HOME: "view::home",
        CALS: "view::cals",
        SEARCH: "view::search",
        CHAT: "view::chat",
        PROFILE: "view::profile"
    },
    SUBVIEW: {
        CHAT: "subview::chat",
        PEOPLE: "subview::people"

    },
    POPUP: {
        OPEN: {
            EVENT: "popup::open::event",
            NEW_EVENT: "popup::open::newevent",
            EDIT_EVENT: "popup::open::editevet",
            CAL: "popup::open::cal"
        },
        CLOSE: {
            EVENT: "popup::close::event",
            NEW_EVENT: "popup::close::newevent",
            EDIT_EVENT: "popup::close::editevent",
            CAL: "popup::close::cal"
        }
    },
    AUTH: {
        LOGIN: {
            SUCCESS: "login::success",
            FAILED: "login::failed",
            PENDING: "login::pending"
        }
    },
    COMPONENT: {
        LOGIN_REGISTER: {
            NAVIGATE: {
                LOGIN: "component::login-register::navigate::login",
                REGISTER: "component::login-register::navigate::register",
            }
        }
    }
}