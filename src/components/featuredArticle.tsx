import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IArticle } from "../types";
import { HeadlineFont } from "./headlineFont";
import { ThemedLink } from "./themedLink";
import { TimeStamp } from "./timeStamp";

const StyledFigure = styled.figure`
  max-height: 480px;
  overflow: hidden;

  img {
    width: 100%;
  }
`;

export const FeaturedArticle: React.FC<{ article: IArticle }> = ({
  article,
}) => {
  const articleUrl = `/article/${article.section}/${article.slug}`;
  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;

  return (
    <Container fluid>
      <Row>
        <Col xs={4}>
          <HeadlineFont>
            <ThemedLink to={articleUrl}>
              <h3 className="d-inline-block">{article.headline}</h3>
            </ThemedLink>
          </HeadlineFont>

          <p className="display-inline-black text-muted mb-2">
            {article.focus}
          </p>

          <span>
            By{" "}
            <ThemedLink to={writerUrl}>
              {article.writer.firstName} {article.writer.lastName}
            </ThemedLink>
          </span>

          <p className="text-muted">
            <TimeStamp originalDate={article.publicationDate} />
          </p>
        </Col>

        <Col xs={8}>
          {article.imageUrl && (
            <Link to={articleUrl}>
              <StyledFigure>
                <img src={article.imageUrl} alt="" />
              </StyledFigure>
            </Link>
          )}
        </Col>
      </Row>
    </Container>
  );
};
