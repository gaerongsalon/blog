import * as fs from "fs";

import SqliteDbContext from "./sqliteDbContext";

export type CloseDb = ({ db, localDbFile }: SqliteDbContext) => void;

function closeSqliteDatabase(): CloseDb {
  return function ({ db, localDbFile }: SqliteDbContext): void {
    db.close();
    fs.unlinkSync(localDbFile);
  };
}

export default closeSqliteDatabase;
