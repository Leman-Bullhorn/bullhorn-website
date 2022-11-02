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
  const sectionName = article.section.toString();
  const articleUrl = `/article/${sectionName}/${article.slug}`;
  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;

  return (
    <Styles fluid>
      <Col xs={7}>
        <HeadlineFont>
          <ThemedLink to={articleUrl}>
            <h4 className="d-inline mb-0">{article.headline}</h4>
          </ThemedLink>
        </HeadlineFont>

        <span>
          By{" "}
          <ThemedLink to={writerUrl}>
            {article.writer.firstName} {article.writer.lastName}
          </ThemedLink>
        </span>

        {article.preview && <p className="text-muted">{article.preview}</p>}

        <p className="text-muted mb-0">
          <TimeStamp originalDate={article.publicationDate} />
        </p>
      </Col>
      <Col xs={5}>
        {article.imageUrl && (
          <Link to={articleUrl}>
            <img src={article.imageUrl} alt="" width="100%" />
          </Link>
        )}
      </Col>
    </Styles>
  );
};
