import { GetDb, GetParams } from "./getSqliteDatabase";

import { CloseDb } from "./closeSqliteDatabase";
import { PutDb } from "./putSqliteDatabase";
import SqliteDbContext from "./sqliteDbContext";

type WithParams<R> = {
  doIn: (params: SqliteDbContext) => Promise<R>;
  autoCommit?: boolean;
} & GetParams;
export type WithDb<R> = (params: WithParams<R>) => Promise<R>;

function withSqliteDatabase({
  getDb,
  putDb,
  closeDb,
}: {
  getDb: GetDb;
  putDb: PutDb;
  closeDb: CloseDb;
}) {
  return async function withDb<R>(
    params: {
      doIn: (params: SqliteDbContext) => R;
      autoCommit?: boolean;
    } & GetParams
  ): Promise<R> {
    const dbContext = await getDb(params);
    try {
      const { doIn } = params;
      const result = doIn(dbContext);
      return result;
    } finally {
      const { autoCommit } = params;
      if (autoCommit) {
        await putDb({
          dbId: params.dbId,
          localDbFile: dbContext.localDbFile,
        });
      }
      closeDb(dbContext);
    }
  };
}

export default withSqliteDatabase;
