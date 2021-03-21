import createTables from "../../db/createTables";
import getAllTags from "../../db/getAllTags";
import getPrivateS3cb from "../../support/getPrivateS3cb";
import secrets from "../../env/secrets";
import useS3Sqlite from "@libs/sqlite/useS3Sqlite";

export default async function queryTags(): Promise<string[]> {
  const { withDb } = useS3Sqlite(getPrivateS3cb());
  return withDb({
    dbId: secrets.dbKey,
    createTableQuery: createTables,
    doIn: ({ db }) => getAllTags({ db }),
  });
}
