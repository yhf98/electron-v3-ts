/*
 * @Author: yaohengfeng 1921934563@qq.com
 * @Date: 2022-12-02 18:19:50
 * @LastEditors: yaohengfeng 1921934563@qq.com
 * @LastEditTime: 2022-12-02 18:34:59
 * @FilePath: \electron-jue-jin\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { devPlugin } from "./plugins/devPlugin";
import optimizer from "vite-plugin-optimizer";
import { buildPlugin } from "./plugins/buildPlugin"
let getReplacer = () => {
  let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  build: {
    assetsInlineLimit: 0,
    minify: false,
    rollupOptions: {
      plugins: [buildPlugin()],
    },
  },
});
