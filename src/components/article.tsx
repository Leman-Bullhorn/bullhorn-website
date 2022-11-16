import styled from "styled-components";

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

export const Article: React.FC<{ article: IArticle }> = ({ article }) => {
  const articleUrl = `/article/${article.section}/${article.slug}`;
  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;

  return (
    <Styles fluid>
      <Col xs={article.imageUrl ? 7 : 12}>
        <HeadlineFont>
          <ThemedLink to={articleUrl}>
            <h4 className="d-inline mb-0">{article.headline}</h4>
          </ThemedLink>
        </HeadlineFont>

        <p className="text-muted mb-2">{article.focus}</p>

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
      <Col>
        {article.imageUrl && (
          <Link to={articleUrl}>
            <img src={article.imageUrl} alt="" width="100%" />
          </Link>
        )}
      </Col>
    </Styles>
  );
};
