## electron-forge-plugin-rspack

This plugin makes it easy to set up standard rspack tooling to compile both your main process code and your renderer process code, with built-in support for Hot Module Replacement (HMR) in the renderer process and support for multiple renderers.

```javascript
// forge.config.ts

import type { ForgeConfig } from "@electron-forge/shared-types";
import { RspackPlugin } from "electron-forge-plugin-rspack";

import { mainConfig } from "./rspack.main.config";
import { rendererConfig } from "./rspack.renderer.config";

const config: ForgeConfig = {
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
};

export default config;
```
