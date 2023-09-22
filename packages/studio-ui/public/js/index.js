// frontend.ts
var startup = function() {
  window.StudioUI.defaultConfigWithEditorLink("app", "https://stgrafxstudiodevpublic.blob.core.windows.net/editor/main/web");
};
var script = document.createElement("script");
script.src = "./studio-ui.js";
script.onload = function() {
  startup();
};
document.head.appendChild(script);
var appDiv = document.getElementById("app");
if (appDiv) {
  appDiv.style.width = "100%";
  appDiv.style.height = "1000px";
  appDiv.style.position = "absolute";
  appDiv.style.top = "0";
  appDiv.style.left = "0";
  appDiv.style.bottom = "0";
  appDiv.style.right = "0";
}
