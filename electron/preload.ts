import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  ping: () => "pong",
});

contextBridge.exposeInMainWorld("electron", {
  minimize: () => ipcRenderer.send("minimize"),
  toggleMaximize: () => ipcRenderer.send("toggle-maximize"),
  close: () => ipcRenderer.send("close"),
});
