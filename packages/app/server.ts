import { BunFile } from "bun";

const { stat } = require("fs").promises;

const BASE_PATH = "./public";

const GRAFX_IDP = `${ensureTrailingSlash(process.env.GRAFX_IDP)}oauth/token` ;
const GRAFX_CLIENT_ID = process.env.GRAFX_CLIENT_ID;
const GRAFX_SECRET = process.env.GRAFX_SECRET;

const ENV_API_BASE = ensureTrailingSlash(process.env.ENV_API_BASE);

const SITECORE_API_BASE = ensureTrailingSlash(process.env.SITECORE_API_BASE);
const SITECORE_TOKEN_URL = `${SITECORE_API_BASE}oauth/token`;
const SITECORE_API_CLIENT_ID = process.env.SITECORE_API_CLIENT_ID;
const SITECORE_API_SECRET = process.env.SITECORE_API_SECRET;

var CGX_TOKEN: string, SITECORE_TOKEN: string;

await refreshTokens();

console.log("Listening on port 3004");
console.log("Navigate to http://localhost:3004/sdk.html for the SDK integration");
console.log("Navigate to http://localhost:3004/studio.html for the Studio UI integration");

Bun.serve({
    port: 3004,
    async fetch(req) {
        const url = new URL(req.url);

        // if root path, redirect to /index.html
        if (url.pathname === "/") {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/studio.html",
                },
            });
        }

        // if studio-ui.js was requested, serve another file
        if (url.pathname === "/studio-ui.js") {
            return new Response(Bun.file("/home/pietervp/studio-ui/dist/bundle.js"));
        }

        // if studio-ui.css was requested, serve another file
        if (url.pathname === "/index.css") {
            return new Response(Bun.file("/home/pietervp/studio-ui/dist/main.css"));
        }

        // api server
        if (url.pathname.startsWith("/api/connector/grafx")) {
            const query = Object.fromEntries(url.searchParams.entries());

            var connectorId = await updateOrAddConnector(Bun.file("./public/connector.json"));

            return new Response(JSON.stringify({
                status: "ok",
                url: url.pathname,
                query,
                connectorId,
                connectorUri: `${ENV_API_BASE}connectors/${connectorId}`
            }, null, 4));
        } else if (url.pathname.startsWith("/api/refresh")) {
            await refreshTokens();
            return generateInfo();
        } else if (url.pathname.startsWith("/api/info")) {
            return generateInfo();
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

function generateInfo(): Response {
    return new Response(JSON.stringify({
        env_api_url: ENV_API_BASE,
        env_api_token: CGX_TOKEN,
        sitecore_api_token: SITECORE_TOKEN,
        sitecore_api_url: SITECORE_API_BASE
    }, null, 4));
}

async function refreshTokens() {
    CGX_TOKEN = await generateAccessTokenCGX();
    SITECORE_TOKEN = await generateAccessTokenSiteCore();
}

async function updateOrAddConnector(connectorJs: BunFile) {

    // log file contents
    console.log("connectorJs", connectorJs);

    const allConnectors = await fetch(`${ENV_API_BASE}experimental/environment/cp-oru-437/connectors`, {
        headers: {
            "Authorization": `Bearer ${CGX_TOKEN}`
        },
        method: "GET"
    }).then(res => res.json());
    console.log("allConnectors", allConnectors);
    return allConnectors;
}

async function generateAccessTokenSiteCore(): Promise<string> {
    const querystring = require('querystring');

    let auth = {
        TokenEndpoint: SITECORE_TOKEN_URL,
        ClientId: SITECORE_API_CLIENT_ID,
        ClientSecret: SITECORE_API_SECRET,
        Scope: null // or null
    };

    let postContent = {
        grant_type: 'client_credentials',
        client_id: auth.ClientId,
        client_secret: auth.ClientSecret
    };

    return fetch(auth.TokenEndpoint, {
        method: 'POST',
        body: querystring.stringify(postContent),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => response.json())
        .then(data => data.access_token)
        .catch(error => console.log(error));

}

async function generateAccessTokenCGX() {

    return await fetch(GRAFX_IDP, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'grant_type': 'client_credentials',
            'audience': 'https://chiligrafx.com',
            'client_id': GRAFX_CLIENT_ID,
            'client_secret': GRAFX_SECRET
        })
    })
        .then(response => response.json())
        .then(data => data.access_token);
}

function ensureTrailingSlash(url: string | undefined) {
    if (!url) {
        return "";
    }
    return url.endsWith("/") ? url : url + "/";
}

