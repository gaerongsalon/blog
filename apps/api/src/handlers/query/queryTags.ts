import createTables from "../../db/createTables";
import getAllTags from "../../db/getAllTags";
import getPrivateS3 from "../../support/getPrivateS3";
import secrets from "@blog/config/lib/secrets";
import sortUniqueStrings from "@blog/utils/lib/sortUniqueStrings";
import useS3Sqlite from "@blog/sqlite/lib/useS3Sqlite";

export default async function queryTags(): Promise<string[]> {
  const { withDb } = useS3Sqlite(getPrivateS3());
  return withDb({
    dbId: secrets.dbKey,
    createTableQuery: createTables,
    doIn: ({ db }) =>
      sortUniqueStrings(
        getAllTags({ db })
          .flatMap((tag) => tag.split(/,/g))
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
  });
}
