const createTables = `
CREATE TABLE IF NOT EXISTS article (
  serial INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  writer TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,
  content TEXT NOT NULL,
  written TEXT NOT NULL,
  draft INTEGER NOT NULL DEFAULT 0
);
`;

export default createTables;
