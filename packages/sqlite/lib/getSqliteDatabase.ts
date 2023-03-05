import Database from "better-sqlite3";
import SqliteDbContext from "./sqliteDbContext";

export type GetParams = {
  dbId: string;
  createTableQuery?: string;
};
export type GetDb = (getParams: GetParams) => Promise<SqliteDbContext>;

function getSqliteDatabase({
  getDbFile,
}: {
  getDbFile: ({
    dbId,
  }: {
    dbId: string;
  }) => Promise<{ localDbFile: string; exists: boolean }>;
}): GetDb {
  return async function get({
    dbId,
    createTableQuery,
  }: GetParams): Promise<SqliteDbContext> {
    const { localDbFile, exists } = await getDbFile({ dbId });
    const db = new Database(localDbFile, {
      verbose: process.env.DEBUG ? console.log : undefined,
    });
    if (!exists && createTableQuery) {
      db.prepare(createTableQuery).run();
    }
    return { db, localDbFile };
  };
}

export default getSqliteDatabase;
