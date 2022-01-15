import { IArticle } from "../types";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import TimeStamp from "./timeStamp";
import { Link } from "react-router-dom";

const getArticleURL = (articleName: string) => {
  return articleName.replace(/[^A-Za-z0-9 -]/g, "").replaceAll(" ", "-");
};

const BorderedDiv = styled.div`
  border-bottom: 1px solid #dddddd;
  margin-bottom: 20px;
  padding-bottom: 20px;
`;

export const ArticleBlock = (props: IArticle) => {
  return (
    <BorderedDiv>
      <Row>
        <Col>
          <h3 className="fw-bolder">{props.headline}</h3>
          {props.preview && <p>{props.preview}</p>}
          <p className="text-muted">
            <TimeStamp originalDate={props.publicationDate} />
          </p>
        </Col>
        <Col xs={4}>
          {props.imageUrl !== "" && (
            <Link to={`/articles/${getArticleURL(props.headline)}`}>
              <figure>
                <img width="100%" src={props.imageUrl} alt="" />
              </figure>
            </Link>
          )}
        </Col>
      </Row>
    </BorderedDiv>
  );
};
