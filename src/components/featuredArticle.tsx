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
  min-height: 500px;
`;

export const FeaturedArticle: React.FC<{ article: IArticle }> = ({
  article,
}) => {
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
              style={{ float: "right", maxHeight: "480px", overflow: "hidden" }}
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
