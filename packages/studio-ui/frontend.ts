/// <reference lib="dom" /> 
/// <reference lib="dom.iterable" />

// inject this, on load execute startup
// <script src="https://stgrafxstudioprdpublic.blob.core.windows.net/end-user-workspace/0.148/latest/bundle.js"></script>

var script = document.createElement('script');
script.src = "./studio-ui.js";
script.onload = function () {
    startup();
};
document.head.appendChild(script);

// find the app div and make it full body sized
var appDiv = document.getElementById('app');
if (appDiv) {
    appDiv.style.width = "100%";
    appDiv.style.height = "1000px";
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

    window.StudioUI.defaultConfigWithEditorLink(
        'app', // selector: string,
        'https://stgrafxstudiodevpublic.blob.core.windows.net/editor/main/web', // editorLink: string,
        // null,// projectDownloadUrl: string,
        // null,// projectUploadUrl: string,
        // null,// projectId: string,
        // null,// graFxStudioEnvironmentApiBaseUrl: string,
        // null,// authToken: string,
        // () => null,// refreshTokenAction: () => Promise<string | AxiosError>,
        // 'test',// projectName: string,
        // () => { },// onBack: () => void,
        // (sdk: any) => { window.sdk = sdk; },// onLoad?: (sdk: typeof SDK) => void,
        // () => { return Promise.resolve( { name: 'templatje', id: '123', template: { id: '123' } }); },// customProjectProvider?: () => Promise<Project>,
        // null// editorLink?: string,
    );
}