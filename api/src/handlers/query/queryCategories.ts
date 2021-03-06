import createTables from "../../db/createTables";
import getCategories from "../../db/getCategories";
import getPrivateS3cb from "../../support/getPrivateS3cb";
import secrets from "@config/secrets.json";
import useS3Sqlite from "@libs/sqlite/useS3Sqlite";

export default async function queryCategories(): Promise<string[]> {
  const { withDb } = useS3Sqlite(getPrivateS3cb());
  return withDb({
    dbId: secrets.dbKey,
    createTableQuery: createTables,
    doIn: ({ db }) => getCategories({ db }),
  });
}
