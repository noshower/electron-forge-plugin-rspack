import { Tab } from "@electron-forge/web-multi-logger";
import { Compiler } from "@rspack/core";

const pluginName = "ElectronForgeLogging";

export default class LoggingPlugin {
  tab: Tab;

  constructor(tab: Tab) {
    this.tab = tab;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.done.tap(pluginName, (stats) => {
      if (stats) {
        this.tab.log(
          stats.toString({
            colors: true,
          })
        );
      }
    });
    compiler.hooks.failed.tap(pluginName, (err) => this.tab.log(err.message));
    compiler.hooks.infrastructureLog.tap(
      pluginName,
      (name: string, _type: string, args: string[]) => {
        this.tab.log(`${name} - ${args.join(" ")}\n`);
        return true;
      }
    );
  }
}
