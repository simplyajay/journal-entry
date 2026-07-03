import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";

export const registerWindowHandlers = (win: BrowserWindow): void => {
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
};
