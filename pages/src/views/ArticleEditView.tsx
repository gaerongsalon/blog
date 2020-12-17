import * as React from "react";
import * as dateFns from "date-fns";

import { Link, useHistory } from "react-router-dom";

import Article from "../models/article/Article";
import ArticleEditor from "../components/ArticleEditor";
import ArticleHeadImageEditor from "../components/ArticleHeadImageEditor";
import BindedLabelInput from "../components/BindedLabelInput";
import LinkStyledButton from "../components/LinkStyledButton";
import NavigationButtons from "../components/NavigationButtons";
import deleteArticle from "../apis/article/deleteArticle";
import handleError from "../utils/handleError";
import updateArticle from "../apis/article/updateArticle";

export default function ArticleEditView({
  article,
}: {
  mode: "new" | "edit";
  article: Article;
}) {
  const [headImage, setHeadImage] = React.useState<string>(article.image);
  const { replace: historyReplace } = useHistory();

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
        historyReplace(`/article/${article.slug}`);
      })
      .catch(handleError);
  }

  function remove() {
    deleteArticle(article)
      .then((result) => {
        console.log(result);
        historyReplace(`/`);
      })
      .catch(handleError);
  }

  return (
    <div className="ArticleEdit">
      <BindedLabelInput property="title" article={article} />
      <ArticleEditor
        preview={false}
        content={article.content}
        updateValue={(newValue) => (article.content = newValue)}
      />
      <ArticleHeadImageEditor
        headImage={headImage}
        updateHeadImage={updateHeadImage}
      />
      <BindedLabelInput
        property="written"
        article={article}
        asString={(date: string) =>
          dateFns.format(
            date ? dateFns.parseISO(date) : new Date(),
            "yyyy-MM-dd"
          )
        }
        fromString={(input: string) =>
          dateFns.formatISO(dateFns.parse(input, "yyyy-MM-dd", new Date()))
        }
      />
      <BindedLabelInput property="excerpt" article={article} textarea={true} />
      <BindedLabelInput property="category" article={article} />
      <BindedLabelInput property="tags" article={article} />
      <NavigationButtons>
        <LinkStyledButton onClick={upload}>SAVE</LinkStyledButton>
        {article.serial ? (
          <LinkStyledButton onClick={remove}>DELETE</LinkStyledButton>
        ) : null}
        {article.serial ? (
          <Link to={() => `/article/${article.slug}`}>CANCEL</Link>
        ) : (
          <Link to="/">HOME</Link>
        )}
      </NavigationButtons>
    </div>
  );
}
