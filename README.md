This repository contains 2 packages:

* `connector` - develop and compile your custom connector + json definition
* `app` - integration using the custom connector (imported from the connector package)

To get started, try running the `build.sh` script in the root of the repository. This will build the connector and the app, and then run the app.

## Connector
Main file is `index.ts` which is compiled into the `build/` directory. The connector is defined in `connector.json`.

To do changes in the json file (default options, etc) please change the connector.template.json file and run the build.sh script.

## App
The application consists of a backend `server.ts` and a frontend app `index.ts`.

### Backend
The backend is doing all things authentication and act as a static file server. On startup, a token for both GraFx and Contenthub is created, and the frontend app is served on `http://localhost:3000`.

There are some minimal api endpoints like `api/info` and `api/refresh` which will respectively return the current token information and perform 

### Frontend
The frontend is a simple web app that loads the sdk, and performs following steps:
* Fetches information from an API endpoint (./api/info) and parses the response as JSON.

* Initializes a new instance of ChiliEditorSDK, passing in a configuration object. This configuration includes the URL of the Chili environment, the document type, the editor ID, and some studio styling options.

* Loads the editor and a document (with an empty JSON object as the argument) using the SDK.

* Sets a configuration value (SITECORE_API_BASE) in the SDK to the API URL from the previously fetched information.

* Registers a connector using the SDK. The connector registration source is specified as a URL, and the URL to the JSON file for the connector is provided. The response from this operation is logged and the parsed data is stored for later use.

* Configures the registered connector by setting an HTTP header, specifically the Authorization header, using a token from the previously fetched information.

* Executes a media query on the registered connector, logs the response, and stores the parsed data for later use.


* Creates an image frame in the document using the SDK, with specified dimensions and position.

* Creates an image variable using the SDK and associates it with the previously registered connector.

* Sets the value of the image variable to a specific image file (./dummy.webp).