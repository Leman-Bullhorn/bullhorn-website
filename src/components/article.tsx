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

export default class Article extends React.Component<IArticle> {
  render() {
    const sectionName = this.props.section.name.toLowerCase();
    const articleUrl = `/article/${sectionName}/${this.props.slug}`;
    const writerUrl = `/writer/${this.props.writer.firstName}-${this.props.writer.lastName}`;

    return (
      <Styles>
        <Card>
          <Card.Body>
            {this.props.imageUrl && (
              <LinkContainer to={articleUrl}>
                <Card.Link>
                  <Card.Img variant="top" src={this.props.imageUrl} />
                </Card.Link>
              </LinkContainer>
            )}

            <Card.Title>
              <LinkContainer to={articleUrl}>
                <Card.Link href={articleUrl}>{this.props.headline}</Card.Link>
              </LinkContainer>
            </Card.Title>

            <Card.Subtitle>
              <Card.Text>
                By:{" "}
                <LinkContainer to={writerUrl}>
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
