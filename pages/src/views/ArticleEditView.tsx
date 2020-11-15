import * as React from "react";

import Article from "../models/article/Article";
import ArticleEditor from "../components/ArticleEditor";
import BindedLabelInput from "../components/BindedLabelInput";
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
    if (!article.written) {
      article.written = new Date().toISOString();
    }
    article.slug = article.title
      .replace(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/g, "")
      .replace(/\s+/g, "-");
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
    <div className="ArticleEdit">
      <BindedLabelInput
        className="ArticleTitle"
        property="title"
        article={article}
      />
      <ImageDropZone
        updateImages={updateHeadImage}
        maxFiles={1}
        DropZoneComponent={
          headImage ? (
            <div className="ArticleHeadImage">
              <label>Head Image</label>
              <img src={headImage} alt="Head" />
            </div>
          ) : (
            <div className="ArticleHeadImage">
              <label>Head Image</label>
              <div>CHOOSE AN IMAGE</div>
            </div>
          )
        }
      />
      <BindedLabelInput
        className="ArticleExcerpt"
        property="excerpt"
        article={article}
        textarea={true}
      />
      <BindedLabelInput
        className="ArticleCategory"
        property="category"
        article={article}
      />
      <BindedLabelInput
        className="ArticleTags"
        property="tags"
        article={article}
      />
      <ArticleEditor
        preview={false}
        content={article.content}
        updateValue={(newValue) => (article.content = newValue)}
      />
      <div className="NavigationButtons">
        <button className="ArticleSave" onClick={upload}>
          Save
        </button>
        {article.serial ? (
          <button className="ArticleDelete" onClick={remove}>
            Delete
          </button>
        ) : null}
        {article.serial ? (
          <Link className="GotoView" to={() => `/article/${article.slug}`}>
            Return to View
          </Link>
        ) : (
          <Link className="GotoHome" to="/">
            Go to home
          </Link>
        )}
      </div>
    </div>
  );
}
