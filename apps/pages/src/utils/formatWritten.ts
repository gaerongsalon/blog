import * as dateFns from "date-fns";

export default function formatWritten(written: string): string {
  return dateFns.format(new Date(written), "yyyy-MM-dd");
}
