import { Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IArticle } from "../types";
import { HeadlineFont } from "./headlineFont";
import { ThemedLink } from "./themedLink";
import { TimeStamp } from "./timeStamp";

const ArticleContainer = styled(Container)`
  padding-bottom: 1rem;
  border-bottom: 1px solid #dddddd;
  min-height: 400px;
`;

interface Props {
  article: IArticle;
}

const FeaturedArticleRegular: React.FC<Props> = ({ article }) => {
  const articleUrl = `/article/${article.section}/${article.slug}`;
  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;

  return (
    <ArticleContainer fluid>
      <Col>
        {article.imageUrl && (
          <Link to={articleUrl}>
            <img
              src={article.imageUrl}
              alt=""
              width="66.667%"
              style={{
                float: "right",
                maxHeight: "480px",
                overflow: "hidden",
                paddingLeft: "0.25rem",
              }}
            />
          </Link>
        )}

        <div>
          <HeadlineFont>
            <ThemedLink to={articleUrl}>
              <h4 style={{ display: "flow-root" }}>{article.headline}</h4>
            </ThemedLink>
          </HeadlineFont>

          <p className="text-muted my-2 fs-6">{article.focus}</p>
        </div>

        <span>
          By{" "}
          <ThemedLink to={writerUrl}>
            {article.writer.firstName} {article.writer.lastName}
          </ThemedLink>
        </span>

        <p className="text-muted mb-0">
          <TimeStamp originalDate={article.publicationDate} />
        </p>
      </Col>
    </ArticleContainer>
  );
};

const FeaturedArticleSmall: React.FC<Props> = ({ article }) => {
  const articleUrl = `/article/${article.section}/${article.slug}`;
  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;

  return (
    <ArticleContainer fluid>
      <Col>
        <HeadlineFont>
          <ThemedLink to={articleUrl}>
            <h4>{article.headline}</h4>
          </ThemedLink>
        </HeadlineFont>

        {article.imageUrl && (
          <Link to={articleUrl}>
            <img
              src={article.imageUrl}
              alt=""
              width="100%"
              style={{
                maxHeight: "480px",
                overflow: "hidden",
              }}
            />
          </Link>
        )}

        <p className="text-muted my-2 fs-6">{article.focus}</p>

        <span>
          By{" "}
          <ThemedLink to={writerUrl}>
            {article.writer.firstName} {article.writer.lastName}
          </ThemedLink>
        </span>

        <p className="text-muted mb-0">
          <TimeStamp originalDate={article.publicationDate} />
        </p>
      </Col>
    </ArticleContainer>
  );
};

export const FeaturedArticle: React.FC<Props> = ({ article }) => {
  return (
    <>
      <div className="d-none d-sm-block">
        <FeaturedArticleRegular article={article} />
      </div>
      <div className="d-sm-none">
        <FeaturedArticleSmall article={article} />
      </div>
    </>
  );
};
