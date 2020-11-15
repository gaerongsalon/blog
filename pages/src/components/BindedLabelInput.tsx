import * as React from "react";

import Article from "../models/article/Article";
import LabelInput from "./LabelInput";

export default function BindedLabelInput<T extends keyof Article>({
  property,
  article,
  fromString = (v) => v as any,
  textarea,
  className,
}: {
  property: T;
  article: Article;
  fromString?: (input: string) => Article[T];
  textarea?: boolean;
  className?: string;
}) {
  return (
    <LabelInput
      label={property}
      initialValue={article[property].toString()}
      setValue={(newValue) => (article[property] = fromString(newValue))}
      textarea={textarea}
      className={className}
    />
  );
}
