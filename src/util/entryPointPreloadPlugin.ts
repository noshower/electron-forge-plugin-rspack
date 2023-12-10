import { PluginBase } from "@electron-forge/plugin-base";

import { EntryPointPluginConfig } from "../config";

export default class EntryPointPreloadPlugin extends PluginBase<EntryPointPluginConfig> {
  name = this.config.name;
  apply() {
    // noop
  }
}
