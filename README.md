# electron-forge-plugin-rspack

> Transform and bundle code for your Electron Forge app with rspack.

## This project forked from [plugin-webpack](https://github.com/electron/forge/tree/main/packages/plugin/webpack), [document](https://www.electronforge.io/config/plugins/webpack#advanced-configuration)

## It's [electron-forge](https://www.electronforge.io/) plugin.

# Installation

```
npm install --save-dev electron-forge-plugin-rspack
```

# Usage

## Plugin configuration

You must provide two rspack configuration files: one for the main process in **mainConfig**, and one for the renderer process in **renderer.config**.The complete config options are available in the API docs under [WebpackPluginConfig](https://js.electronforge.io/interfaces/_electron_forge_plugin_webpack.WebpackPluginConfig.html)

For example, this is the configuration taken from [electron-forge-rspack-template](https://github.com/noshower/electron-forge-rspack-template):

```javascript
// forge.config.ts

import type { ForgeConfig } from "@electron-forge/shared-types";
import { RspackPlugin } from "electron-forge-plugin-rspack";

import { mainConfig } from "./rspack.main.config";
import { rendererConfig } from "./rspack.renderer.config";

const config: ForgeConfig = {
  // ...
  plugins: [
    new RspackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
  // ...
};

export default config;
```

## Project files

This plugin generates a separate entry for the main process, as well as each renderer process and preload script.

You need to do two things in your project files in order to make this plugin work.

### package.json

First, your main entry in your package.json file needs to point at "./.rspack/main" like so:

```
// package.json
{
  "name": "my-app",
  "main": "./.rspack/main",
  // ...
}
```

### Main process code

Second, all loadURL and preload paths need to reference the magic global variables that this plugin will define for you.

Each entry point has two globals defined based on the name assigned to your entry point:

- The renderer's entry point will be suffixed with **\_RSPACK_ENTRY**

- The renderer's preload script will be suffixed with **\_PRELOAD_RSPACK_ENTRY**

In the case of the **main_window** entry point in the earlier example, the global variables will be named **MAIN_WINDOW_RSPACK_ENTRY** and **MAIN_WINDOW_PRELOAD_RSPACK_ENTRY**. An example of how to use them is given below:

```
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: MAIN_WINDOW_PRELOAD_RSPACK_ENTRY
  }
});

mainWindow.loadURL(MAIN_WINDOW_RSPACK_ENTRY);
```

These variables are only defined in the main process. If you need to use one of these paths in a renderer (e.g. to pass a preload script to a <webview> tag), you can pass the magic variable value with a synchronous IPC round trip.

```
// main.js
// make sure this listener is set before your renderer.js code is called
ipcMain.on('get-preload-path', (e) => {
  e.returnValue = WINDOW_PRELOAD_WEBPACK_ENTRY;
});


// prelaod.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getPreloadPath: () => ipcRenderer.sendSync('get-preload-path')
});

// renderer.js
const preloadPath = window.electron.getPreloadPath();
```

### Usage with Typescript

If you're using the rspack plugin with TypeScript, you will need to manually declare these magic variables to avoid compiler errors.

```
// main.ts
declare const MAIN_WINDOW_RSPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_RSPACK_ENTRY: string;
```

### Other

this plugin uses [@rspack/dev-server](https://www.rspack.dev/config/dev-server.html) to help you quickly iterate on renderer process code in development mode. Running **electron-forge start** with the rspack plugin active will launch a dev server that is configurable through the plugin config.

## Example

```
git clone https://github.com/noshower/electron-forge-rspack-template
cd electron-forge-rspack-template
npm i
npm start
```
