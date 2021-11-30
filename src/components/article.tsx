import React from "react";
import { Card } from "react-bootstrap";
import styled from "styled-components";

import Contributor from "../contributor";
import TimeStamp from "./timeStamp";

interface ArticleProps {
  headline: string;
  contributors: Contributor[];
  creationDate: Date;
  imageUrl?: string;
  featured?: boolean;
}

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

export default class Article extends React.Component<ArticleProps> {
  render() {
    return (
      <Styles>
        <Card border="white">
          <Card.Body>
            {this.props.imageUrl && (
              <Card.Link
                href={`/articles/${getArticleURL(this.props.headline)}`}>
                <Card.Img variant="top" src={this.props.imageUrl} />
              </Card.Link>
            )}
            <Card.Title>
              <Card.Link
                href={`/articles/${getArticleURL(this.props.headline)}`}>
                {this.props.headline}
              </Card.Link>
            </Card.Title>
            <Card.Subtitle>
              <Card.Text>
                By:{" "}
                {this.props.contributors.map((contributor, idx) => {
                  return (
                    <Card.Link
                      key={contributor.getHyphenatedName()}
                      href={`/contributors/${contributor.getHyphenatedName()}`}>
                      {idx === this.props.contributors.length - 1
                        ? `${contributor.getFirstName()} ${contributor.getLastName()}`
                        : `${contributor.getFirstName()} ${contributor.getLastName()}, `}
                    </Card.Link>
                  );
                })}
              </Card.Text>

              <Card.Text className="text-muted">
                <TimeStamp originalDate={this.props.creationDate} />
              </Card.Text>
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </Styles>
    );
  }
}
