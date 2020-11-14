// email "#" name [ "|" email "#" name ]*
const blogWriters = process.env.BLOG_WRITERS!;

export interface Writer {
  email: string;
  name: string;
}

const writers: Writer[] = blogWriters
  .split("|")
  .map((each) => each.trim())
  .filter(Boolean)
  .map((each) => each.split("#"))
  .map(([email, name]) => ({ email, name }))
  .filter((writer) => !!writer.email && !!writer.name);

export default writers;
