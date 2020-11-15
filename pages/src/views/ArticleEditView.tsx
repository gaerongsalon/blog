import * as React from "react";

import Article from "../models/article/Article";
import ArticleEditor from "../components/ArticleEditor";
import ImageDropZone from "../components/ImageDropZone";
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
  const [headImage, setHeadImage] = React.useState<string>(article.image);

  function updateHeadImage(images: string[]) {
    const [image] = images;
    article.image = image;
    setHeadImage(image);
  }

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
      <BindedLabelInput property="title" article={article} />
      <ImageDropZone
        updateImages={updateHeadImage}
        maxFiles={1}
        DropZoneComponent={
          headImage ? <img src={headImage} alt="Head" /> : <p>Drop</p>
        }
      />
      <BindedLabelInput property="excerpt" article={article} />
      <BindedLabelInput property="category" article={article} />
      <BindedLabelInput property="tags" article={article} />
      <ArticleEditor
        preview={false}
        content={article.content}
        updateValue={(newValue) => (article.content = newValue)}
      />
      <button onClick={upload}>Save</button>
      {article.serial ? <button onClick={remove}>Delete</button> : null}
      {article.serial ? (
        <Link to={() => `/article/${article.slug}`}>Return to View</Link>
      ) : (
        <Link to="/">Go to home</Link>
      )}
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
