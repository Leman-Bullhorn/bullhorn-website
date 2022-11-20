import styled from "styled-components";
import { IArticle } from "../types";
import { Col, Placeholder, Row } from "react-bootstrap";
import { TimeStamp } from "./timeStamp";
import { Link } from "react-router-dom";
import { ThemedLink } from "./themedLink";
import { HeadlineFont } from "./headlineFont";
import { TextPlaceholder } from "./textPlaceholder";

const BorderedDiv = styled.div`
  border-bottom: 1px solid #dddddd;
  margin-bottom: 20px;
`;

const StyledImg = styled.img`
  transition: opacity 0.25s ease-in-out;
  border-radius: calc(0.25rem - 1px);

  :hover,
  :hover {
    opacity: 0.7;
  }
`;

export const ArticleBlock = (props: IArticle) => {
  const sectionName = props.section.toLowerCase();
  const articleUrl = `/article/${sectionName}/${props.slug}`;
  const writerUrl = `/writer/${props.writer.firstName}-${props.writer.lastName}`;

  return (
    <BorderedDiv>
      <Row>
        <Col>
          <HeadlineFont>
            <h3 className="fw-bolder">
              <ThemedLink to={articleUrl}>{props.headline}</ThemedLink>
            </h3>
          </HeadlineFont>

          <p className="text-muted">{props.focus}</p>
          <span>
            By{" "}
            <ThemedLink to={writerUrl}>
              {props.writer.firstName} {props.writer.lastName}
            </ThemedLink>
          </span>
          <p className="text-muted">
            <TimeStamp originalDate={props.publicationDate} />
          </p>
        </Col>
        <Col xs={4}>
          {props.imageUrl !== "" && (
            <Link to={`/article/${sectionName}/${props.slug}`}>
              <figure>
                <StyledImg width="100%" src={props.imageUrl} alt="" />
              </figure>
            </Link>
          )}
        </Col>
      </Row>
    </BorderedDiv>
  );
};

export const ArticleBlockPlaceholder = () => {
  return (
    <BorderedDiv>
      <Row>
        <Col>
          <HeadlineFont>
            <Placeholder as="h3" animation="glow">
              <TextPlaceholder xs={9} />
              <br />
              <TextPlaceholder xs={3} />
            </Placeholder>
          </HeadlineFont>
          <Placeholder animation="glow" className="text-muted">
            <TextPlaceholder xs={10} size="xs" />
            <br />
            <TextPlaceholder xs={10} size="xs" />
            <br />
            <TextPlaceholder xs={5} size="xs" />
          </Placeholder>
        </Col>
        <Col xs={4}>
          <Placeholder
            as="div"
            animation="glow"
            style={{ width: "100%", height: "100%" }}>
            <Placeholder
              as="img"
              xs={12}
              height="100%"
              style={{ borderRadius: "calc(-1px + 0.25rem)" }}
            />
          </Placeholder>
        </Col>
      </Row>
    </BorderedDiv>
  );
};
