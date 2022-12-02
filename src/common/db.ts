import knex, { Knex } from "knex";
import fs from "fs";
import path from "path";
let dbInstance: Knex;
if (!dbInstance) {
  let dbPath;
  if (location.href.startsWith("http")) {
    dbPath = path.join(process.execPath, "../../../../src/common/db.db");
  } else {
    dbPath = process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "/Library/Preferences" : process.env.HOME + "/.local/share");
    dbPath = path.join(dbPath, "electron-jue-jin/db.db");
    let dbIsExist = fs.existsSync(dbPath);
    console.log("copy", dbIsExist, dbPath);
    if (!dbIsExist) {
      let resourceDbPath = path.join(process.execPath, "../resources/db.db");
      fs.copyFileSync(resourceDbPath, dbPath);
      console.log("copy");
    }
  }
  dbInstance = knex({
    client: "better-sqlite3",
    connection: { filename: dbPath },
    useNullAsDefault: true,
  });
}
export let db = dbInstance;
