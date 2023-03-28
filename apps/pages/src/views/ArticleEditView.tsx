import * as React from "react";
import * as dateFns from "date-fns";

import Article from "../models/article/Article";
import ArticleHeadImageEditor from "../components/ArticleHeadImageEditor";
import BindedLabelInput from "../components/BindedLabelInput";
import LinkStyledButton from "../components/LinkStyledButton";
import NavigationButtons from "../components/NavigationButtons";
import deleteArticle from "../apis/article/deleteArticle";
import fetchJson from "../utils/fetchJson";
import handleError from "../utils/handleError";
import loadSyntaxModule from "../utils/loadSyntaxModule";
import trimTags from "../utils/trimTags";
import updateArticle from "../apis/article/updateArticle";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

const LazyArticleEditor = React.lazy(
  () => import("../components/ArticleEditor")
);

export default function ArticleEditView({
  article,
}: {
  mode: "new" | "edit";
  article: Article;
}) {
  const [syntaxModuleLoaded, setSyntaxModuleLoaded] =
    React.useState<boolean>(false);
  const [headImage, setHeadImage] = React.useState<string>(article.image);
  const [, setCategory] = React.useState<string>(article.category);
  const [, setTags] = React.useState<string>(article.tags);
  const { data: allTags = [] } = useSWR<string[]>("/api/tags", fetchJson);
  const { data: allCategories = [] } = useSWR<string[]>(
    "/api/categories",
    fetchJson
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    loadSyntaxModule()
      .then(() => setSyntaxModuleLoaded(true))
      .catch((error) => {
        console.error({ error }, "Cannot load syntax module");
        setSyntaxModuleLoaded(false);
      });
  }, []);

  function updateHeadImage(images: string[]) {
    const [image] = images;
    article.image = image;
    setHeadImage(image);
  }
  function updateCategory(category: string) {
    article.category = category;
    setCategory(category);
  }

  function addTag(tag: string) {
    const currentTags = (article.tags || "")
      .split(/,/g)
      .map((e) => e.trim())
      .filter(Boolean);
    if (currentTags.includes(tag)) {
      return;
    }
    currentTags.push(tag);
    article.tags = currentTags.join(", ");
    setTags(article.tags);
  }

  function upload() {
    if (!article.written) {
      article.written = new Date().toISOString();
    }
    article.slug = article.title
      .replace(/[-!$%^&*()+|~=`{}[\]:";'<>?,./]/g, "")
      .replace(/\s+/g, "-");
    article.draft++;
    updateArticle(article)
      .then(() => {
        navigate(`/article/${article.slug}`, { replace: true });
      })
      .catch(handleError);
  }

  function remove() {
    deleteArticle(article)
      .then(() => {
        navigate(`/`, { replace: true });
      })
      .catch(handleError);
  }

  if (!syntaxModuleLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="ArticleEdit">
      <BindedLabelInput property="title" article={article} />
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyArticleEditor
          preview={false}
          content={article.content}
          updateValue={(newValue) => (article.content = newValue)}
        />
      </React.Suspense>
      <ArticleHeadImageEditor
        headImage={headImage}
        updateHeadImage={updateHeadImage}
      />
      <BindedLabelInput
        property="written"
        article={article}
        type="date"
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
      <BindedLabelInput property="excerpt" article={article} type="textarea" />
      <BindedLabelInput property="category" article={article} />
      <Categories categories={allCategories} onClick={updateCategory} />
      <BindedLabelInput property="tags" article={article} asString={trimTags} />
      <Tags tags={allTags} onClick={addTag} />
      <NavigationButtons>
        <LinkStyledButton onClick={upload}>SAVE</LinkStyledButton>
        {article.serial ? (
          <LinkStyledButton onClick={remove}>DELETE</LinkStyledButton>
        ) : null}
      </NavigationButtons>
    </div>
  );
}

function Categories({
  categories,
  onClick,
}: {
  categories: string[];
  onClick: (category: string) => void;
}) {
  return (
    <div className="References">
      {categories.map((category) => (
        <span key={category} onClick={() => onClick(category)}>
          {category}
        </span>
      ))}
    </div>
  );
}

function Tags({
  tags,
  onClick,
}: {
  tags: string[];
  onClick: (tag: string) => void;
}) {
  return (
    <div className="References">
      {tags.map((tag) => (
        <span key={tag} onClick={() => onClick(tag)}>
          {tag}
        </span>
      ))}
    </div>
  );
}
