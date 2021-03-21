import SqliteDatabase from "./SqliteDatabase";

export default interface SqliteDbContext {
  db: SqliteDatabase;
  localDbFile: string;
}
