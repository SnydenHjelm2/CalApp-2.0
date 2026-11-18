const req = {
    async send(endpoint, method, body = null) {
        let options = {
            headers: {"Content-Type": "application/json"},
            method: method.toUpperCase()
        }

        if (body) options.body = JSON.stringify(body);

        let request = new Request("http://localhost:8000/" + endpoint, options);

        let resp = await fetch(request);

        let reso = await resp.json();
        return {
            status: resp.status,
            statusText: resp.statusText,
            body: reso
        };
    }
}

const spawn = {
    test(endpoint, response, test) {
        let div = document.createElement("div");
        div.classList.add("test");
        div.innerHTML = `
            <h2>${test.method} /${endpoint}</h2>
            <p>${response.status} ${response.statusText}</p>
            <p>${test.desc}</p>
            <p>
            <pre>
                <code>
                    ${JSON.stringify(response.body)}
                </code>
            </pre>
        `;

        if (response.status === test.expected) div.classList.add("success");
        else div.classList.add("fail");
        document.body.appendChild(div);
    }
}

const test = {
    endpoints: ["users", "calendars", "users_calendars", "events", "users_events", "users_users", "cal_msgs", "priv_msgs"],

    async resetDb(endpoint) {
        if (endpoint) await req.send("backup?entity=" + endpoint, "GET");
        else await req.send("backup?entity=all", "GET");
    },

    async run(endpoint, method, params, body) {
        if (params) endpoint += `?${params}`;

        if (method === "GET") {
            let reso = await req.send(endpoint, method);
            return {
                endpoint: endpoint,
                reso: reso
            };
        } else {
            let reso = await req.send(endpoint, method, body);
            return {
                endpoint: endpoint,
                reso: reso
            };
        }
    },

    async runAll() {
        for (let endpoint of this.endpoints) {
            for (let test of this.tests[endpoint]) {
                let result = await this.run(endpoint, test.method, test.params, test.body);
                spawn.test(result.endpoint, result.reso, test);
            }

            await this.resetDb(endpoint);
            let allTests = document.querySelectorAll(".test");
            let allSuccess = document.querySelectorAll(".success");
            document.querySelector("h3").textContent = `Succeeded tests: ${allSuccess.length}/${allTests.length}`;
        }

    },

    tests: {
        users: [
            {
                params: null,
                method: "GET",
                body: null,
                desc: "Get all users",
                expected: 200
            },

            {
                params: "id=65e10aa11a001",
                method: "GET",
                body: null,
                desc: "Get user by ID",
                expected: 200
            },

            {
                params: "id=fakeId",
                method: "GET",
                body: null,
                desc: "Get user by invalid ID",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    pwd: "test",
                    email: "test@test.com"
                },
                desc: "Create new user",
                expected: 201
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    pwd: "test",
                },
                desc: "Create new user with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    pwd: "test",
                    email: "elle@gamil.com"
                },
                desc: "Create new user with existing email",
                expected: 409
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    id: "65e10aa11a001",
                    name: "test",
                    pwd: "test",
                },
                desc: "Edit user credentials",
                expected: 200
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    pwd: "test",
                },
                desc: "Edit user credentials with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    id: "fakeId",
                    name: "test",
                    pwd: "test",
                },
                desc: "Edit user credentials with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    id: "65e10aa11a001",
                    email: "elle@gamil.com",
                    pwd: "test"
                },
                desc: "Delete user",
                expected: 200
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    email: "elle@gamil.com",
                    pwd: "test"
                },
                desc: "Delete user with invalid request body (missing userId)",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    id: "65e10aa11a001",
                    pwd: "test"
                },
                desc: "Delete user with invalid request body (missing pwd or email)",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    id: "fakeId",
                    email: "elle@gamil.com",
                    pwd: "test"
                },
                desc: "Delete user with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    id: "65e10aa11a002",
                    email: "elle@gamil.com",
                    pwd: "wrong"
                },
                desc: "Delete user with wrong credentials",
                expected: 403
            },
        ],

        calendars: [
            {
                params: null,
                method: "GET",
                body: null,
                desc: "Get all calendars",
                expected: 200
            },

            {
                params: "id=673a1f8b2c4d1",
                method: "GET",
                body: null,
                desc: "Get calendar by ID",
                expected: 200
            },

            {
                params: "id=fakeId",
                method: "GET",
                body: null,
                desc: "Get calendar by invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    isPublic: 0,
                    creatorId: "65e10aa11a001"
                },
                desc: "Create new calendar",
                expected: 201
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    isPublic: 0,
                    creatorId: "65e10aa11a001"
                },
                desc: "Create new calendar with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    isPublic: "test",
                    creatorId: "65e10aa11a001"
                },
                desc: "Create new calendar with invalid type of isPublic attribute",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    isPublic: 3,
                    creatorId: "65e10aa11a001"
                },
                desc: "Create new calendar with invalid value of isPublic attribute",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    isPublic: 0,
                    creatorId: "fakeId"
                },
                desc: "Create new calendar, connection fail to be made (ex invalid creatorId)",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    name: "test",
                    description: "test",
                    isPublic: 1,
                },
                desc: "Edit calendar",
                expected: 200
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    name: "test",
                    description: "test",
                    isPublic: 3,
                },
                desc: "Edit calendar with invalid value of isPublic or isDeleted",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    name: "test",
                    description: "test",
                    isPublic: "test",
                },
                desc: "Edit calendar with invalid type of isPublic or isDeleted",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a002",
                    name: "test",
                    description: "test",
                    isPublic: 1,
                },
                desc: "Edit calendar where user is not member of calendar",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a007",
                    name: "test",
                    description: "test",
                    isPublic: 1,
                },
                desc: "Edit calendar where user does not have permission to edit",
                expected: 401
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "fakeId",
                    userId: "65e10aa11a001",
                    name: "test",
                    description: "test",
                    isPublic: 1,
                },
                desc: "Edit calendar with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                },
                desc: "Edit calendar with no changeable attributes",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "fakeId",
                    name: "test"
                },
                desc: "Edit calendar with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001"
                },
                desc: "Delete calendar",
                expected: 200
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                },
                desc: "Delete calendar with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "fakeId",
                    userId: "65e10aa11a001"
                },
                desc: "Delete calendar with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a002"
                },
                desc: "Delete calendar with userId not in cal",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a007"
                },
                desc: "Delete calendar with userId without permissions to delete",
                expected: 401
            },
        ],

        users_calendars: [
            {
                params: null,
                method: "GET",
                body: null,
                desc: "Get all users_calendars connections",
                expected: 200
            },

            {
                params: "id=6af5a7bf0fc0d",
                method: "GET",
                body: null,
                desc: "Get users_calendars connection by ID",
                expected: 200
            },

            {
                params: "userId=65e10aa11a001",
                method: "GET",
                body: null,
                desc: "Get all users_calendars connections by userId",
                expected: 200
            },

            {
                params: "calId=673a1f8b2c4d1",
                method: "GET",
                body: null,
                desc: "Get all users_calendars connections by calId",
                expected: 200
            },

            {
                params: "id=fakeId",
                method: "GET",
                body: null,
                desc: "Get users_calendars connection by invalid ID",
                expected: 404
            },

            {
                params: "userId=fakeId",
                method: "GET",
                body: null,
                desc: "Get all users_calendars connections by invalid userId",
                expected: 404
            },

            {
                params: "calId=fakeId",
                method: "GET",
                body: null,
                desc: "Get all users_calendars connections by invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d2",
                    isCreator: 0,
                    canAll: 0
                },
                desc: "Create new users_calendars connection (add user to calendar)",
                expected: 201
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d2",
                    isCreator: 0,
                },
                desc: "Create new users_calendars connection (add user to calendar) with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "fakeId",
                    calId: "673a1f8b2c4d2",
                    isCreator: 0,
                    canAll: 0
                },
                desc: "Create new users_calendars connection (add user to calendar) with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    calId: "fakeId",
                    isCreator: 0,
                    canAll: 0
                },
                desc: "Create new users_calendars connection (add user to calendar) with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d1",
                    isCreator: 0,
                    canAll: 0
                },
                desc: "Create new users_calendars connection (add user to calendar) where connection already exists",
                expected: 409
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d3",
                    isCreator: 0,
                    canAll: "test"
                },
                desc: "Create new users_calendars connection (add user to calendar) where invalid type was used in permissions attribute",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d3",
                    isCreator: 0,
                    canAll: 3
                },
                desc: "Create new users_calendars connection (add user to calendar) where invalid value was used in permissions attribute",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d1",
                    canDelete: 1
                },
                desc: "Edit users_calendars connection permissions",
                expected: 200
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d4",
                    canAll: 1
                },
                desc: "Edit users_calendars connection permissions where connection does not exist",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    canAll: 1
                },
                desc: "Edit users_calendars connection permissions with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "fakeId",
                    calId: "673a1f8b2c4d1",
                    canAll: 1
                },
                desc: "Edit users_calendars connection permissions with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    calId: "fakeId",
                    canAll: 1
                },
                desc: "Edit users_calendars connection permissions with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d1"
                },
                desc: "Delete users_calendars connection",
                expected: 200
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65e10aa11a001",
                },
                desc: "Delete users_calendars connection with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "fakeId",
                    calId: "673a1f8b2c4d1"
                },
                desc: "Delete users_calendars connection with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65e10aa11a001",
                    calId: "fakeId"
                },
                desc: "Delete users_calendars connection with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65e10aa11a001",
                    calId: "673a1f8b2c4d6"
                },
                desc: "Delete users_calendars connection where connection does not exist",
                expected: 404
            }
        ],

        events: [
            {
                params: null,
                method: "GET",
                body: null,
                desc: "Get all events",
                expected: 200
            },

            {
                params: "eventId=6900000000010",
                method: "GET",
                body: null,
                desc: "Get event by ID",
                expected: 200
            },

            {
                params: "calId=673a1f8b2c4d2",
                method: "GET",
                body: null,
                desc: "Get all events by calId",
                expected: 200
            },

            {
                params: "eventId=fakeId",
                method: "GET",
                body: null,
                desc: "Get event by invalid ID",
                expected: 404
            },

            {
                params: "calId=fakeId",
                method: "GET",
                body: null,
                desc: "Get all events by invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    date: "2026-11-17",
                    time: "22:00",
                    location: "Niagara, Malmö University",
                    tags: "",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001"
                },
                desc: "Create new event",
                expected: 201
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    date: "2026-11-17",
                    time: "22:00",
                    location: "Niagara, Malmö University",
                    tags: "",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001"
                },
                desc: "Create new event with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    date: "2026-11-17",
                    time: "22:00",
                    location: "Niagara, Malmö University",
                    tags: "",
                    calId: "fakeId",
                    userId: "65e10aa11a001"
                },
                desc: "Create new event with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    date: "2026-11-17",
                    time: "22:00",
                    location: "Niagara, Malmö University",
                    tags: "",
                    calId: "673a1f8b2c4d1",
                    userId: "fakeId"
                },
                desc: "Create new event with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    date: "2026-11-17",
                    time: "22:00",
                    location: "Niagara, Malmö University",
                    tags: "",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a008"
                },
                desc: "Create new event where user is not member of cal",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    name: "test",
                    description: "test",
                    date: "2026-11-17",
                    time: "22:00",
                    location: "Niagara, Malmö University",
                    tags: "",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a007"
                },
                desc: "Create new event where user does not have permissions to create events",
                expected: 401
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    eventId: "690000000000a"
                },
                desc: "Edit event",
                expected: 200
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    calId: "673a1f8b2c4d1",
                    eventId: "690000000000a"
                },
                desc: "Edit event with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    eventId: "690000000000a"
                },
                desc: "Edit event with no pacthable attributes in request body",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    calId: "fakeId",
                    userId: "65e10aa11a001",
                    eventId: "690000000000a"
                },
                desc: "Edit event with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    calId: "673a1f8b2c4d1",
                    userId: "fakeId",
                    eventId: "690000000000a"
                },
                desc: "Edit event with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    eventId: "fakeId"
                },
                desc: "Edit event with invalid eventId",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a008",
                    eventId: "690000000000a"
                },
                desc: "Edit event where user is not in cal",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    name: "test",
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a007",
                    eventId: "690000000000a"
                },
                desc: "Edit event where user does not have permissions",
                expected: 401
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    eventId: "690000000000a"
                },
                desc: "Delete event",
                expected: 200
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "690000000000a"
                },
                desc: "Delete event with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "fakeId",
                    userId: "65e10aa11a001",
                    eventId: "690000000000a"
                },
                desc: "Delete event with invalid calId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "fakeId",
                    eventId: "690000000000a"
                },
                desc: "Delete event with invalid userId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a001",
                    eventId: "fakeId"
                },
                desc: "Delete event with invalid eventId",
                expected: 404
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a008",
                    eventId: "6900000000006"
                },
                desc: "Delete event where user is not in cal",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    calId: "673a1f8b2c4d1",
                    userId: "65e10aa11a007",
                    eventId: "6900000000006"
                },
                desc: "Delete event where user does not have permissions",
                expected: 401
            },
        ],

        users_events: [
            {
                params: null,
                method: "GET",
                body: null,
                desc: "Get all users_events connections",
                expected: 200
            },

            {
                params: "userId=65e10aa11a002",
                method: "GET",
                body: null,
                desc: "Get all users_events connections by userId",
                expected: 200
            },

            {
                params: "eventId=6900000000010",
                method: "GET",
                body: null,
                desc: "Get all users_events connections by eventId",
                expected: 200
            },

            {
                params: "eventId=6900000000010&userId=65e10aa11a002",
                method: "GET",
                body: null,
                desc: "Get specific users_events connections by eventId and userId",
                expected: 200
            },

            {
                params: "id=6af5a80f6825f",
                method: "GET",
                body: null,
                desc: "Get specific users_events connections by ID",
                expected: 200
            },

            {
                params: "id=fakeId",
                method: "GET",
                body: null,
                desc: "Get specific users_events connections by invalid ID",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "6900000000010",
                    isCreator: 0
                },
                desc: "Create new users_events connection",
                expected: 201
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    isCreator: 0
                },
                desc: "Create new users_events connection with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "fakeId",
                    isCreator: 0
                },
                desc: "Create new users_events connection with invalid eventId",
                expected: 404
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "6900000000010",
                    isCreator: 0
                },
                desc: "Create new users_events connection where connection already exists",
                expected: 409
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "690000000002b",
                    isCreator: 0
                },
                desc: "Create new users_events connection where calendar is private and user is not member of calendar",
                expected: 401
            },

            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "690000000000a",
                    isCreator: "test"
                },
                desc: "Create new users_events connection with invalid type of isCreator attribute",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "690000000008c",
                    isComing: 1
                },
                desc: "Edit users_events connection",
                expected: 200
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    eventId: "6900000000010",
                    isComing: 1
                },
                desc: "Edit users_events connection with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "fakeId",
                    isComing: 1
                },
                desc: "Edit users_events connection with invalid eventId",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a008",
                    eventId: "690000000008c",
                    isComing: 1
                },
                desc: "Edit users_events connection where connection does not exist",
                expected: 404
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "690000000008c",
                    isComing: "test"
                },
                desc: "Edit users_events connection with invalid type of isComing, isNotComing, isInterested attributes",
                expected: 400
            },

            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "690000000008c",
                    isComing: 3
                },
                desc: "Edit users_events connection with invalid value of isComing, isNotComing, isInterested attributes",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65e10aa11a001",
                    eventId: "690000000008c",
                },
                desc: "Delete connection by userId and eventId",
                expected: 200
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    id: "6af5a80f682df"
                },
                desc: "Delete connection by ID",
                expected: 200
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65e10aa11a001",
                },
                desc: "Delete connection with invalid request body",
                expected: 400
            },

            {
                params: null,
                method: "DELETE",
                body: {
                    id: "fakeId"
                },
                desc: "Delete connection with invalid ID",
                expected: 404
            },
        ],

        users_users: [
            {
                params: null,
                method: "GET",
                body: null,
                desc: "Get all users_users",
                expected: 200
            },
            {
                params: "userId=65e10aa11a001",
                method: "GET",
                body: null,
                desc: "Get all users_users by userId",
                expected: 200
            },            {
                params: "userId=fakeID",
                method: "GET",
                body: null,
                desc: "Get all users_users by invalid userid",
                expected: 404
            },
            {
                params: "userId1=65e10aa11a001&userId2=65e10aa11a002",
                method: "GET",
                body: null,
                desc: "Get users_users by userIds",
                expected: 200
            },
            {
                params: "userId1=65e10aa11a002&userId2=fake651a001",
                method: "GET",
                body: null,
                desc: "Get users_users by one real one fake userId",
                expected: 404
            },
            {
                params: null,
                method: "POST",
                body: {
                    actor: "65e10aa11a002",
                    userId: "fakeID",
                    friends: 0
                },
                desc: "Post new users_users for actor - USER DOES NOT EXIST",
                expected: 400
            },
            {
                params: null,
                method: "POST",
                body: {
                    actor: "65e10aa11a002"
                },
                desc: "Post new users_users for actor - missing attributes",
                expected: 400
            },
            {
                params: null,
                method: "POST",
                body: {
                    actor: "65e10aa11a002",
                    userId: "65e10aa11a002",
                    friends: 0
                },
                desc: "Post new users_users for equal userIds",
                expected: 400
            },
            {
                params: null,
                method: "POST",
                body: {
                    actor: "65f3aa11a015",
                    userId: "65f3aa11a011",
                    friends: 0
                },
                desc: "Post new users_users!!",
                expected: 200
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    actor: "65f3aa11a011",
                    userId: "65f3aa11a015",
                    friends: 1
                },
                desc: "PATCH users_users (new friend!)",
                expected: 200
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65f3aa11a015",
                    friends: 1
                },
                desc: "PATCH users_users: Missing attributes",
                expected: 400
            }

        ],

        cal_msgs: [
            {   
                params: null,
                method: "GET",
                body: null,
                desc: "Get all cal_msgs: Missing attributes",
                expected: 400
            },
            {
                params: "calId=673a1f8b2c4d1&actor=65e10aa11a001",
                method: "GET",
                body: null,
                desc: "Get all cal_msgs by calId & userId",
                expected: 200
            },
            {
                params: null,
                method: "POST",
                body: {
                    senderId: "65e10aa11a001",
                    calId: "673a1f8b2c4d1",
                    content: "NO NO NO WAAAAY+?"
                },
                desc: "Post new cal_msg",
                expected: 201
            },
            {
                params: null,
                method: "POST",
                body: {
                    calId: "673a1f8b2c4d1",
                    content: "NO NO NO WAAAAY+?"
                },
                desc: "Post new cal_msg: Missing Attributes: senderId",
                expected: 400
            },
            {
                params: null,
                method: "POST",
                body: {
                    senderId: "65e10aa11a001",
                    content: "NO NO NO WAAAAY+?"
                },
                desc: "Post new cal_msg: Missing attributes: calId",
                expected: 400
            },
            {
                params: null,
                method: "POST",
                body: {
                    senderId: "65e10aa11a001",
                    calId: "673a1f8b2c4d1"
                },
                desc: "Post new cal_msg: Missing attributes: content",
                expected: 400
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    id: "6af593693b088",
                    userId: "65f3aa11a004",
                    content: "Can everyone review the attached notes before we meet? NO WAAAAY?!"
                },
                desc: "Patch a cal_msg",
                expected: 200
            },
            {
                params: null,
                method: "PATCH",
                body: null,
                desc: "Patch a cal_msg: empty body",
                expected: 400
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    userId: "65f3aa11a004",
                    content: "Can everyone review the attached notes before we meet? NO WAAAAY?!"
                },
                desc: "Patch a cal_msg: Missing attributes: id",
                expected: 400
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    id: "6af593693b088",
                    content: "Can everyone review the attached notes before we meet? NO WAAAAY?!"
                },
                desc: "Patch a cal_msg: Missing attributes: calId",
                expected: 400
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    id: "6af593693b088",
                    userId: "65f3aa11a004",
                },
                desc: "Patch a cal_msg: Missing attributes: content",
                expected: 400
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    id: "6af593693b088",
                    userId: "65f3aa11a003",
                    content: "Can everyone review the attached notes before we meet? NO WAAAAY?!"
                },
                desc: "Patch a cal_msg : userId not creator of message",
                expected: 409
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    id: "6af593693b088",
                    userId: "fakeId",
                    content: "Can everyone review the attached notes before we meet? NO WAAAAY?!"
                },
                desc: "Patch a cal_msg : Fake userId",
                expected: 409
            },
            {
                params: null,
                method: "DELETE",
                body: {
                    id: "6af593693b088",
                    userId: "65f3aa11a004"
                },
                desc: "DELETE message",
                expected: 200
            },
            {
                params: null,
                method: "DELETE",
                body: null,
                desc: "DELETE message: Missing attributes: empty body",
                expected: 400
            },
            {
                params: null,
                method: "DELETE",
                body: {
                    id: "6af593693b088"
                },
                desc: "DELETE message: Missing attributes: userId",
                expected: 400
            },
            {
                params: null,
                method: "DELETE",
                body: {
                    userId: "65f3aa11a004"
                },
                desc: "DELETE message: Missing attributes: id",
                expected: 400
            },
            {
                params: null,
                method: "DELETE",
                body: {
                    id: "6af593693b086",
                    userId: "fakeId"
                },
                desc: "DELETE message: Fake userId",
                expected: 409
            },
            {
                params: null,
                method: "DELETE",
                body: {
                    id: "6af593693b086",
                    userId: "65f3aa11a004"
                },
                desc: "DELETE message: UserId not sender of message",
                expected: 409
            }
        ],

        priv_msgs: [
            {
                params: null,
                method: "GET",
                body: null,
                desc: "GET all private messages",
                expected: 200
            },
            {
                params: "userId=65e10aa11a001",
                method: "GET",
                body: null,
                desc: "GET all private messages by userId",
                expected: 200
            },
            {
                params: "userId=FakeId",
                method: "GET",
                body: null,
                desc: "GET all private messages by fakeId",
                expected: 404
            },
            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    receiverId: "65e10aa11a004",
                    content: "HELLOOOOO"
                },
                desc: "POST new private message",
                expected: 200
            },
            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a001",
                    content: "HELLOOOOO"
                },
                desc: "POST new private message: Missing attributes",
                expected: 400
            },
            {
                params: null,
                method: "POST",
                body: {
                    userId: "65e10aa11a004",
                    receiverId: "fakeID",
                    content: "HELLOOOOO"
                },
                desc: "POST new private message: fake senderId",
                expected: 404
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    privMsgId: "6af5951052317",
                    content: "Sorry, I repeated myself"
                },
                desc: "PATCH private message",
                expected: 200
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    privMsgId: "fakeId",
                    content: "Sorry, I repeated myself"
                },
                desc: "PATCH private message: fake messageId",
                expected: 404
            },
            {
                params: null,
                method: "PATCH",
                body: null,
                desc: "PATCH private message: Missing attributes",
                expected: 400
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    privMsgId: "6af5951052317"
                },
                desc: "PATCH private message: Missing attributes: content",
                expected: 400
            },
            {
                params: null,
                method: "PATCH",
                body: {
                    content: "Sorry, I repeated myself"
                },
                desc: "PATCH private message: Missing attributes: privMsgId",
                expected: 400
            },
            {
                params: null,
                method: "DELETE",
                body: {
                    privMsgId: "6af5951052317"
                },
                desc: "DELETE private message",
                expected: 200
            },
            {
                params: null,
                method: "DELETE",
                body: null,
                desc: "DELETE private message: missing body",
                expected: 400
            },
            {
                params: null,
                method: "DELETE",
                body: {
                    privMsgId: "fakeMsgId"
                },
                desc: "DELETE private message: FakeId",
                expected: 404
            }
        ]
    }
}

test.runAll();