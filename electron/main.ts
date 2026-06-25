import path from "path";
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { initializeDatabase } from "./db/database";
import { registerJevHandlers } from "./ipc/jev.handlers";
import { registerAuthHandlers } from "./ipc/auth.handlers";
import { registerStoreHandlers } from "./ipc/session.handler";
import { registerWindowHandlers } from "./ipc/window.handlers";

let win: BrowserWindow;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 800,
    frame: false,
    thickFrame: true,
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
};

app.whenReady().then(async () => {
  try {
    initializeDatabase();
  } catch (err) {
    console.error("[DB] Failed to initialize database:", err);
    app.quit();
    return;
  }

  registerJevHandlers();
  registerAuthHandlers();
  registerStoreHandlers();

  createWindow();

  registerWindowHandlers(win);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
