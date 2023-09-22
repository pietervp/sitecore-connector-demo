/// <reference lib="dom" /> 
/// <reference lib="dom.iterable" />

import ChiliEditorSDK, { ConfigType, ConnectorRegistrationSource, DocumentType, FrameTypeEnum, SlideDirections, VariableType } from "@chili-publish/studio-sdk";

declare global {
    interface Window {
        sdk: ChiliEditorSDK;
    }
}

async function load() {
    var info = await fetch("./api/info").then(res => res.json());
    const uiBackgroundColorHex = "#333333";

    // set body background color
    document.body.style.backgroundColor = uiBackgroundColorHex;

    //@ts-ignore
    var sdk: ChiliEditorSDK = new ChiliEditorSDK.default({
        chiliEnvironmentUrl: "https://chili-dev.chili-publish.com",
        documentType: DocumentType.template,
        editorId: "app",
        studioStyling: {
            theme: "light",
            uiBackgroundColorHex: uiBackgroundColorHex,
        },
        studioOptions: {
            shortcutOptions: {
            }
        }
    } as ConfigType);

    window.sdk = sdk;

    sdk.loadEditor();
    await sdk.document.load("{}");

    // var result = await fetch("./api/start").then(res => res.json());
    // result.connectorId;

    // var loadedConnectorId = await sdk.connector.register({
    //     source: ConnectorRegistrationSource.grafx,
    //     url: result.connectorUri
    // }).then(res => res.parsedData);

    console.log(`about to set '${info.sitecore_api_url}'`);
    console.log(await sdk.configuration.setValue("SITECORE_API_BASE", info.sitecore_api_url));
    console.log('done setting');
    
    var loadedConnectorId = await sdk.connector.register({
        source: ConnectorRegistrationSource.url,
        url: "./connector.json"
    }).then(res => {
        console.log(res);
        return res.parsedData;
    });


    console.log(info);
    await sdk.connector.configure(loadedConnectorId!, async (config) => {
        console.log(await config.setHttpHeader("Authorization", "Bearer " + info.sitecore_api_token));        
    });

    console.log(loadedConnectorId);

    var queryResults = await sdk.mediaConnector.query(loadedConnectorId!, {}, {}).then(res => {
        console.log(res);
        return res.parsedData;
    });

    // add image frame to document
    var frameId = await sdk.frame.create(FrameTypeEnum.image, 0,0,200,200);
    var varId = await sdk.variable.create("", VariableType.image);
    await sdk.variable.setImageVariableConnector(varId.parsedData!, loadedConnectorId!);

    console.log(await sdk.variable.setValue(varId.parsedData!, "./dummy.webp"));
    //@ts-ignore
    await sdk.frame.updateImageSource(frameId.parsedData!, {'type': 'variable', 'id': varId.parsedData!});
    

    // find or create div results
    var divResults = document.getElementById("results");
    if (!divResults) {
        divResults = document.createElement("div");
        divResults.id = "results";
        document.body.appendChild(divResults);
    }

    // add results
    divResults.innerHTML = JSON.stringify(queryResults, null, 4);
}

load();