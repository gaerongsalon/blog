import * as React from "react";

import Article from "../models/article/Article";
import ArticleEditor from "../components/ArticleEditor";
import { Link } from "react-router-dom";
import deleteArticle from "../apis/deleteArticle";
import handleError from "../utils/handleError";
import updateArticle from "../apis/updateArticle";

export default function ArticleEditView({
  article,
}: {
  mode: "new" | "edit";
  article: Article;
}) {
  console.log(article);
  function upload() {
    article.written = article.written ?? new Date().toISOString();
    article.draft++;
    updateArticle(article)
      .then((result) => {
        console.log(result);
        window.location.replace(`/article/${article.slug}`);
      })
      .catch(handleError);
  }

  function remove() {
    deleteArticle(article)
      .then((result) => {
        console.log(result);
        window.location.replace(`/`);
      })
      .catch(handleError);
  }
  return (
    <div>
      <BindedLabelInput property="slug" article={article} />
      <BindedLabelInput property="writer" article={article} />
      <BindedLabelInput property="title" article={article} />
      <BindedLabelInput property="image" article={article} />
      <BindedLabelInput property="excerpt" article={article} />
      <BindedLabelInput property="category" article={article} />
      <BindedLabelInput property="tags" article={article} />
      <ArticleEditor
        preview={false}
        content={article.content}
        updateValue={(newValue) => (article.content = newValue)}
      />
      <button onClick={upload}>Save</button>
      <button onClick={remove}>Delete</button>
      <Link to={() => `/article/${article.slug}`}>Return to View</Link>
    </div>
  );
}

function BindedLabelInput<T extends keyof Article>({
  property,
  article,
  fromString = (v) => v as any,
}: {
  property: T;
  article: Article;
  fromString?: (input: string) => Article[T];
}) {
  return (
    <LabelInput
      label={property}
      initialValue={article[property].toString()}
      setValue={(newValue) => (article[property] = fromString(newValue))}
    />
  );
}

function LabelInput({
  label,
  initialValue,
  setValue,
}: {
  label: string;
  initialValue: string;
  setValue: (newValue: string) => void;
}) {
  return (
    <div>
      <label>
        {label}
        <input
          type="text"
          defaultValue={initialValue}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
    </div>
  );
}
