import { ViteDevServer } from "vite";
import { internalModule } from "./internalModule";
import fs from "fs-extra";
export let devPlugin = () => {
  return {
    name: "dev-plugin",
    // load(id: string): string {
    //   if (id.endsWith(".non.exist.js")) {
    //     return fs.readFileSync(id).toString("utf8");
    //   }
    // },
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });
      server.httpServer.once("listening", () => {
        let { spawn } = require("child_process");
        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", `http://127.0.0.1:${server.config.server.port}`], {
          cwd: process.cwd(),
          stdio: "inherit",
        });
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
