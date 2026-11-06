const { app, BrowserWindow, dialog } = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { desktopDataDirectory } = require("./data-path.cjs");
let server;
if (process.platform === "win32")
  app.setAppUserModelId("com.qubix.classroom");
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.whenReady().then(async () => {
    try {
      const { startServer } = await import(
        pathToFileURL(path.join(app.getAppPath(), "dist/server/index.js")).href
      );
      const options = {
        dataDir: desktopDataDirectory(app.getPath("appData"), app.getPath("userData")),
        staticDir: path.join(app.getAppPath(), "dist/client"),
        port: 3210,
      };
      try {
        server = await startServer(options);
      } catch (error) {
        if (error.code === "EADDRINUSE")
          server = await startServer({ ...options, port: 0 });
        else throw error;
      }
      const window = new BrowserWindow({
        width: 1440,
        height: 960,
        minWidth: 1000,
        minHeight: 720,
        backgroundColor: "#160e32",
        autoHideMenuBar: true,
        title: "Qubix",
        icon: app.isPackaged
          ? path.join(process.resourcesPath, "icon.ico")
          : path.join(__dirname, "../assets/icon.ico"),
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
        },
      });
      window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
      window.webContents.on("will-navigate", (event, url) => {
        if (new URL(url).origin !== new URL(server.hostURL).origin)
          event.preventDefault();
      });
      await window.loadURL(server.hostURL);
    } catch (error) {
      dialog.showErrorBox("Qubix could not start", String(error.message));
      app.quit();
    }
  });
  app.on("second-instance", () => {
    const window = BrowserWindow.getAllWindows()[0];
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
  });
  app.on("window-all-closed", () => app.quit());
  let closing = false;
  app.on("before-quit", (event) => {
    if (server && !closing) {
      event.preventDefault();
      closing = true;
      server.close().finally(() => app.quit());
    }
  });
}
