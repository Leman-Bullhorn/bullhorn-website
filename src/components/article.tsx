import styled, { css } from "styled-components";

import { IArticle } from "../types";
import { TimeStamp } from "./timeStamp";
import { HeadlineFont } from "./headlineFont";
import { ThemedLink } from "./themedLink";
import { Link } from "react-router-dom";

const Styles = styled.div<{ bottom?: boolean }>`
  padding-bottom: 0.75rem;
  padding-top: 0.75rem;

  ${(props: any) =>
    !props.bottom &&
    css`
      border-bottom: 1px solid #dddddd;
    `}

  img {
    transition: opacity 0.25s ease-in-out;
    border-radius: calc(0.25rem - 1px);
  }

  img:hover {
    opacity: 0.7;
  }
`;

interface ArticleProps extends IArticle {
  bottom?: boolean;
}

export const Article = (props: ArticleProps) => {
  const sectionName = props.section.toString();
  const articleUrl = `/article/${sectionName}/${props.slug}`;
  const writerUrl = `/writer/${props.writer.firstName}-${props.writer.lastName}`;

  return (
    <Styles bottom={props.bottom}>
      {props.imageUrl && (
        <Link to={articleUrl}>
          <img src={props.imageUrl} alt="" width="100%" />
        </Link>
      )}

      <HeadlineFont>
        <ThemedLink to={articleUrl}>
          <h4>{props.headline}</h4>
        </ThemedLink>
      </HeadlineFont>

      <span>
        By{" "}
        <ThemedLink to={writerUrl}>
          {props.writer.firstName} {props.writer.lastName}
        </ThemedLink>
      </span>

      {props.preview && <p className="text-muted">{props.preview}</p>}

      <p className="text-muted">
        <TimeStamp originalDate={props.publicationDate} />
      </p>
    </Styles>
  );
};
