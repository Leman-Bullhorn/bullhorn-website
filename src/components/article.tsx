import { Card } from "react-bootstrap";
import styled from "styled-components";
import { LinkContainer } from "./linkContainer";

import { IArticle } from "../types";
import { TimeStamp } from "./timeStamp";
import { HeadlineFont } from "./headlineFont";

const Styles = styled.div`
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

export const Article = (props: IArticle) => {
  const sectionName = props.section.name.toLowerCase();
  const articleUrl = `/article/${sectionName}/${props.slug}`;
  const writerUrl = `/writer/${props.writer.firstName}-${props.writer.lastName}`;

  return (
    <Styles>
      <Card>
        <Card.Body>
          {props.imageUrl && (
            <LinkContainer to={articleUrl}>
              <Card.Link>
                <Card.Img variant="top" src={props.imageUrl} />
              </Card.Link>
            </LinkContainer>
          )}

          <HeadlineFont>
            <Card.Title>
              <LinkContainer to={articleUrl}>
                <Card.Link>{props.headline}</Card.Link>
              </LinkContainer>
            </Card.Title>
          </HeadlineFont>

          <Card.Subtitle>
            <Card.Text>
              By{" "}
              <LinkContainer to={writerUrl}>
                <Card.Link>
                  {props.writer.firstName} {props.writer.lastName}
                </Card.Link>
              </LinkContainer>
            </Card.Text>

            {props.preview && (
              <Card.Text className="text-muted">{props.preview}</Card.Text>
            )}

            <Card.Text className="text-muted">
              <TimeStamp originalDate={props.publicationDate} />
            </Card.Text>
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Styles>
  );
};
