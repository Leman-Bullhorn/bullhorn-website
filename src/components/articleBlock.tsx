import { IArticle } from "../types";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import TimeStamp from "./timeStamp";
import { Link } from "react-router-dom";

const BorderedDiv = styled.div`
  border-bottom: 1px solid #dddddd;
  margin-bottom: 20px;
  padding-bottom: 20px;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin-left: 0;
  margin-right: 0;

  :hover {
    color: rgb(${({ theme }) => theme.lemanColorComponents});
    text-decoration: underline;
  }
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
  const sectionName = props.section.name.toLowerCase();
  const articleUrl = `/article/${sectionName}/${props.slug}`;

  return (
    <BorderedDiv>
      <Row>
        <Col>
          <h3 className="fw-bolder">
            <StyledLink to={articleUrl}>{props.headline}</StyledLink>
          </h3>

          {props.preview && <p>{props.preview}</p>}
          <p className="text-muted">
            <TimeStamp originalDate={props.publicationDate} />
          </p>
        </Col>
        <Col xs={4}>
          {props.imageUrl !== "" && (
            <Link
              to={`/article/${props.section.name.toLowerCase()}/${props.slug}`}>
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
