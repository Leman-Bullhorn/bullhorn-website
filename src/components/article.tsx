import React from "react";
import { Card } from "react-bootstrap";
import styled from "styled-components";
import LinkContainer from "./linkContainer";

import { IArticle } from "../types";
import TimeStamp from "./timeStamp";

const Styles = styled.div`
  font-family: serif;

  .card {
    margin-bottom: 1rem;
  }

  .card-link {
    color: black;
    text-decoration: none;
    margin-left: 0;
    margin-right: 0;
  }

  .card-link:hover {
    color: rgb(${({ theme }) => theme.lemanColorComponents});
    text-decoration: underline;
  }

  .card-img,
  .card-img-top {
    transition: opacity 0.25s ease-in-out;
    border-radius: calc(0.25rem - 1px);
  }

  .card-img:hover,
  .card-img-top:hover {
    opacity: 0.7;
  }
`;

const getArticleURL = (articleName: string) => {
  return articleName.replace(/[^A-Za-z0-9 -]/g, "").replaceAll(" ", "-");
};

export default class Article extends React.Component<IArticle> {
  render() {
    return (
      <Styles>
        <Card border="white">
          <Card.Body>
            {this.props.imageUrl && (
              <LinkContainer
                to={`/articles/${getArticleURL(this.props.headline)}`}>
                <Card.Link>
                  <Card.Img variant="top" src={this.props.imageUrl} />
                </Card.Link>
              </LinkContainer>
            )}

            <Card.Title>
              <LinkContainer
                to={`/articles/${getArticleURL(this.props.headline)}`}>
                <Card.Link
                  href={`/articles/${getArticleURL(this.props.headline)}`}>
                  {this.props.headline}
                </Card.Link>
              </LinkContainer>
            </Card.Title>

            <Card.Subtitle>
              <Card.Text>
                By:{" "}
                <LinkContainer
                  to={`/writer/${this.props.writer.firstName}-${this.props.writer.lastName}`}>
                  <Card.Link>
                    {this.props.writer.firstName} {this.props.writer.lastName}
                  </Card.Link>
                </LinkContainer>
              </Card.Text>

              {this.props.preview && (
                <Card.Text>{this.props.preview}</Card.Text>
              )}

              <Card.Text className="text-muted">
                <TimeStamp originalDate={this.props.publicationDate} />
              </Card.Text>
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </Styles>
    );
  }
}
