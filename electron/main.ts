import path from "path";
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { initializeDatabase } from "./db/database";
import { registerJevHandlers } from "./ipc/handlers/jev";
import { registerAuthHandlers } from "./ipc/handlers/auth";
import { registerStoreHandlers } from "./ipc/handlers/session";
import { registerWindowHandlers } from "./ipc/handlers/window";
import { registerOrganizationHandlers } from "./ipc/handlers/organization";

let win: BrowserWindow;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1204,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    frame: false,
    titleBarStyle: "hidden",
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

  registerAuthHandlers();
  registerStoreHandlers();
  registerOrganizationHandlers();
  registerJevHandlers();

  createWindow();

  registerWindowHandlers(win);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
