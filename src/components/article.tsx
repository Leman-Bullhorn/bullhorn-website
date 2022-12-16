import styled, { CSSProperties } from "styled-components";

import { IArticle } from "../types";
import { TimeStamp } from "./timeStamp";
import { HeadlineFont } from "./headlineFont";
import { ThemedLink } from "./themedLink";
import { Link } from "react-router-dom";
import { Col, Container } from "react-bootstrap";

const Styles = styled(Container)`
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dddddd;
  display: flex;

  img {
    border-radius: calc(0.25rem - 1px);
  }
`;

export const Article: React.FC<{
  article: IArticle;
  style?: CSSProperties;
}> = ({ article, style }) => {
  const articleUrl = `/article/${article.section}/${article.slug}`;
  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;
  return (
    <Styles fluid style={style}>
      <Col>
        {article.imageUrl && (
          <Link to={articleUrl}>
            <img
              src={article.imageUrl}
              alt=""
              width="45%"
              style={{ float: "right", paddingLeft: "0.25rem" }}
            />
          </Link>
        )}

        <div>
          <HeadlineFont>
            <ThemedLink to={articleUrl}>
              <h4 className="d-inline">{article.headline}</h4>
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
    </Styles>
  );
};
