const { stat } = require("fs").promises;

const BASE_PATH = "./public";

Bun.serve({
    port: 3003,
    async fetch(req) {
        const url = new URL(req.url);

        // if root path, redirect to /index.html
        if (url.pathname === "/") {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/index.html",
                },
            });
        }

        // if studio-ui.js was requested, serve another file
        if (url.pathname === "/studio-ui.js") {
            return new Response(Bun.file("/home/pietervp/studio-ui/dist/bundle.js"));
        }

        // if studio-ui.js was requested, serve another file
        if (url.pathname === "/index.css") {
            return new Response(Bun.file("/home/pietervp/studio-ui/dist/main.css"));
        }

        // static file server to test the app
        const filePath = BASE_PATH + new URL(req.url).pathname;
        console.log(filePath);
        const fileData = await stat(filePath);
        return new Response(Bun.file(filePath));

    },
    error() {
        return new Response(null, { status: 404 });
    },
});