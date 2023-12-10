# electron-forge-plugin-rspack

## This project forked from [plugin-webpack](https://github.com/electron/forge/tree/main/packages/plugin/webpack)

## It's [electron-forge](https://www.electronforge.io/) plugin.

## Usage

This plugin makes it easy to set up standard rspack tooling to compile both your main process code and your renderer process code, with built-in support for Hot Module Replacement (HMR) in the renderer process and support for multiple renderers.

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

```
//  src/main.ts

// ...
declare const MAIN_WINDOW_RSPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_RSPACK_ENTRY: string;

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_RSPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_RSPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

// ...
```

## Example

```
git clone https://github.com/noshower/electron-forge-rspack-template
cd electron-forge-rspack-template
npm i
npm start
```
