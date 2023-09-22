/// <reference lib="dom" /> 
/// <reference lib="dom.iterable" />

import type SDK from "@chili-publish/studio-sdk";
import { ConnectorRegistrationSource, FrameTypeEnum, VariableType } from "@chili-publish/studio-sdk";

var script = document.createElement('script');
script.src = "https://stgrafxstudiodevpublic.blob.core.windows.net/shared/studio-ui-sitecore/bundle.js";
script.onload = function () {
    startup();
};
document.head.appendChild(script);

// find the app div and make it full body sized
var appDiv = document.getElementById('app');
if (appDiv) {
    appDiv.style.width = "100%";
    appDiv.style.height = "100%";
    appDiv.style.position = "absolute";
    appDiv.style.top = "0";
    appDiv.style.left = "0";
    appDiv.style.bottom = "0";
    appDiv.style.right = "0";
}

declare global {
    interface Window {
        StudioUI: any;
    }
}

function startup() {

    const engine_version = 'https://stgrafxstudiodevpublic.blob.core.windows.net/editor/457-68c5f7cb16637e4852c2521401526c944a403f2e/web';
    const demoDocumentLoader = new DemoDocumentLoader(engine_version);

    return new window.StudioUI('app', {
        projectId: 'demo',
        projectName: 'Demo',
        onProjectInfoRequested: demoDocumentLoader.onProjectInfoRequested,
        onProjectTemplateRequested: demoDocumentLoader.onProjectTemplateRequested,
        onProjectLoaded: (project: Project, sdk: SDK) => {

            setTimeout(async () => {

                var info = await fetch("./api/info").then(res => res.json());
                log('load-event', 'project loaded', project, sdk);
                log('load-event',`about to set '${info.sitecore_api_url}'`);
                log('load-event-sdk.configuration.setValue',await sdk.configuration.setValue("SITECORE_API_BASE", info.sitecore_api_url));
                log('load-event','done setting');

                const registration = {
                    source: ConnectorRegistrationSource.url,
                    url: "./connector.json"
                };

                // add image frame to document
                var frameId = await sdk.frame.create(FrameTypeEnum.image, 0, 0, 200, 200);
                var varId = await sdk.variable.create("", VariableType.image);
                log('sdk.frame.create+sdk.variable.create', frameId, varId);

                var newConnector = await sdk.variable.setImageVariableConnector(varId.parsedData!, JSON.stringify(registration))
                log('sdk.variable.setImageVariableConnector', newConnector);

                log('auth-info',info);
                log('sdk.connector.configure',await sdk.connector.configure(newConnector.parsedData!, async (config) => {
                    log('config.setHttpHeader', await config.setHttpHeader("Authorization", "Bearer " + info.sitecore_api_token));
                }));

                log('sdk.variable.setValue',await sdk.variable.setValue(varId.parsedData!, "https://dummyimage.com/600x400/000/fff"));
                //@ts-ignore
                log('sdk.frame.updateImageSource', await sdk.frame.updateImageSource(frameId.parsedData!, { 'type': 'variable', 'id': varId.parsedData! }));
            }, 2000); // we need to introduce an additional callback to make sure the sdk is fully loaded

        },
        onProjectSave: demoDocumentLoader.onProjectSave,
        onAuthenticationRequested: demoDocumentLoader.onAuthenticationRequested,
        onAuthenticationExpired: demoDocumentLoader.onAuthenticationExpired,
        onUserInterfaceBack: () => {
            // ignored
        },
        onLogInfoRequested: demoDocumentLoader.onLogInfoRequested,
        onProjectGetDownloadLink: demoDocumentLoader.onProjectGetDownloadLink,
        overrideEngineUrl: engine_version,
    });

    // console.log wrapper to make structured logging easier
    function log(method: string, ...data: any[]) {
        console.log(`[${method}]`, data);
    }
}

type Project = {
    id: string;
    name: string;
    template: {
        id: string;

    };
}

type DownloadLinkResult = {
}

class DemoDocumentLoader {
    editorLink: string;

    onProjectInfoRequested: (projectId: string) => Promise<Project>;

    onProjectTemplateRequested: (projectId: string) => Promise<string>;

    onProjectLoaded: (project: Project, sdk: SDK) => void;

    onProjectSave: () => Promise<Project>;

    onAuthenticationRequested: () => string;

    onAuthenticationExpired: () => Promise<string>;

    onLogInfoRequested: () => unknown;

    onProjectGetDownloadLink: (extension: string, selectedLayoutID: string | undefined) => Promise<DownloadLinkResult>;

    demoId: string;

    /**
     *
     */
    constructor(editorLink: string) {
        this.editorLink = editorLink;
        this.demoId = '21d8c0e0-0b0e-4e1e-8b0a-0b0e4e1e8b0a';
        this.onProjectInfoRequested = async (): Promise<Project> => {
            return {
                id: this.demoId,
                name: 'Demo',
                template: {
                    id: this.demoId,
                },
            };
        };
        this.onProjectTemplateRequested = async (): Promise<string> => {
            return "{}";
            try {
                var req = (await fetch(`${editorLink}/assets/assets/documents/demo.json`));

                if (req.status == 200) {
                    return req.text();
                }
                else {
                    return (await fetch(`${editorLink}/assets/packages/runtime_assets/assets/documents/demo.json`)).text();
                }
            } catch (error) {
                return (await fetch(`${editorLink}/assets/packages/runtime_assets/assets/documents/demo.json`)).text();
            }
        };
        this.onAuthenticationExpired = async (): Promise<string> => {
            return '';
        };
        this.onAuthenticationRequested = (): string => {
            return '';
        };
        this.onProjectLoaded = (): void => {
            // ignored
        };
        this.onProjectSave = async (): Promise<Project> => {
            return { id: this.demoId, name: 'Demo', template: { id: this.demoId } };
        };
        this.onLogInfoRequested = (): unknown => {
            return { demo: true, editorLink };
        };
        this.onProjectGetDownloadLink = () => {
            return Promise.resolve({
                status: 200,
                error: undefined,
                success: true,
                parsedData: undefined,
                data: undefined,
            });
        };
    }
}
