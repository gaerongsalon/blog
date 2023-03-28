import createTables from "../../db/createTables";
import getCategories from "../../db/getCategories";
import getPrivateS3cb from "../../support/getPrivateS3cb";
import secrets from "@blog/config/lib/secrets";
import sortUniqueStrings from "@blog/utils/lib/sortUniqueStrings";
import useS3Sqlite from "@blog/sqlite/lib/useS3Sqlite";

export default async function queryCategories(): Promise<string[]> {
  const { withDb } = useS3Sqlite(getPrivateS3cb());
  return withDb({
    dbId: secrets.dbKey,
    createTableQuery: createTables,
    doIn: ({ db }) =>
      sortUniqueStrings(
        getCategories({ db })
          .map((category) => category.trim())
          .filter(Boolean)
      ),
  });
}
