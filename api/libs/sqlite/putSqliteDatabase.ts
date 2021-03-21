import * as fs from "fs";

type PutParams = {
  dbId: string;
  localDbFile: string;
};
export type PutDb = (putParams: PutParams) => Promise<void>;

function putSqliteDatabase({
  putDbFile,
}: {
  putDbFile: ({ dbId, localDbFile }: PutParams) => Promise<void>;
}): PutDb {
  return async function store({ dbId, localDbFile }: PutParams): Promise<void> {
    if (!fs.existsSync(localDbFile) || fs.lstatSync(localDbFile).size === 0) {
      return;
    }
    await putDbFile({ dbId, localDbFile });
  };
}

export default putSqliteDatabase;
