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
    FILTER: {       // Används för <filter-bar>
        HOME: {
            UPCOMING: "filter::home::upcoming",
            INVITED: "filter::home::invited",
            HOSTING: "filter::home::hosting",
        },
        CALS: {
            ALL: "filter::cals::all",
            PRIVATE: "filter::cals::private",
            PUBLIC: "filter::cals::public"
        },
        SEARCH: {
            EVENT: "filter::search::event",
            CAL: "filter::search::cal",
            USER: "filter::search::user",
        },
        CHAT: {
            ALL: "filter::chat::all",
            DM: "filter::chat::dm",
            CAL: "filter::chat::cal"
        },
        PEOPLE: {
            FRIENDS: "filter::people::friends",
            BLOCKED: "filter::people::blocked",
            REQUEST: "filter::people::request"
        }










    }
}