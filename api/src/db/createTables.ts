const createTables = `
CREATE TABLE IF NOT EXISTS article (
  slug TEXT PRIMARY KEY,
  writer TEXT,
  title TEXT,
  image TEXT,
  excerpt TEXT,
  category TEXT,
  tags TEXT,
  writeDate TEXT
);
`;

export default createTables;
