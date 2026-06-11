import { app, BrowserWindow, ipcMain, Menu } from "electron";
import path from "path";

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: "hidden",
    transparent: true,
    frame: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);
  win.loadURL("http://localhost:5173");
  win.webContents.openDevTools({
    mode: "detach",
  });
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("minimize", () => {
    win.minimize();
  });

  ipcMain.on("toggle-maximize", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("close", () => {
    win.close();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
