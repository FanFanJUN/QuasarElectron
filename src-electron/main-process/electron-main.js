import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import puppeteer from "puppeteer-core";
import pie from "puppeteer-in-electron";

let mainWindow;

let global = {
  browser: null,
  page: null,
};
const openPmos = async (event, params) => {
  _setLog(params);
  const window = new BrowserWindow();
  const url = params.url;
  await window.loadURL(url);
  // window.maximize();
  // window.show();
  const page = await pie.getPage(global.browser, window);
  global.page = page;
  // 等待页面加载完成
  await page.waitForSelector('input[name="username"]');
  // 输入用户名
  await page.type('input[name="username"]', params.username);
  await page.waitForTimeout(1000);
  // 执行脚本
  _setLog(page.url());
};

function _setLog(msg) {
  if (!mainWindow) return;
  mainWindow.webContents.send("setLog", msg);
}

function registerApiHandler() {
  ipcMain.handle("openPmos", openPmos);
}

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
}

async function main() {
  try {
    if (
      process.platform === "win32" &&
      nativeTheme.shouldUseDarkColors === true
    ) {
      require("fs").unlinkSync(
        require("path").join(app.getPath("userData"), "DevTools Extensions")
      );
    }
  } catch (_) {}

  /**
   * Set `__statics` path to static files in production;
   * The reason we are setting it here is that the path needs to be evaluated at runtime
   */
  if (process.env.PROD) {
    global.__statics = __dirname;
  }
  await pie.initialize(app);
  await app.whenReady();
  global.browser = await pie.connect(app, puppeteer);

  createWindow();
  registerApiHandler();
  app.on("ready", () => {});

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
    }
  });
}

main();
