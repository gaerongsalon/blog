import * as React from "react";

import Article from "../models/article/Article";
import LabelInput from "./LabelInput";

export default function BindedLabelInput<T extends keyof Article>({
  property,
  article,
  asString = (v) => v.toString(),
  fromString = (v) => v as any,
  type = "text",
}: {
  property: T;
  article: Article;
  asString?: (input: Article[T]) => string;
  fromString?: (input: string) => Article[T];
  type?: "text" | "date" | "textarea";
}) {
  return (
    <LabelInput
      label={property}
      initialValue={asString(article[property])}
      setValue={(newValue) => (article[property] = fromString(newValue))}
      type={type}
    />
  );
}
