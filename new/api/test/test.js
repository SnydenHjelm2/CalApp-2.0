const req = {
    async send(endpoint, method, body = null) {
        let options = {
            headers: {"Content-Type": "application/json"},
            method: method.toUpperCase()
        }

        if (body) options.body = JSON.stringify(body);

        let request = new Request("http://localhost:8000/" + endpoint, options);

        let resp = await fetch(request);
        console.log(resp.status);

        let reso = await resp.json();
        console.log(reso);
    }
}