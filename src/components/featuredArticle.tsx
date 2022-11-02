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
  const sectionName = article.section.toString();
  const articleUrl = `/article/${sectionName}/${article.slug}`;
  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;

  return (
    <div>
      <HeadlineFont>
        <ThemedLink to={articleUrl}>
          <h3 className="d-inline-block">{article.headline}</h3>
        </ThemedLink>
      </HeadlineFont>

      {article.imageUrl && (
        <Link to={articleUrl}>
          <StyledFigure>
            <img src={article.imageUrl} alt="" />
          </StyledFigure>
        </Link>
      )}

      <span>
        By{" "}
        <ThemedLink to={writerUrl}>
          {article.writer.firstName} {article.writer.lastName}
        </ThemedLink>
      </span>

      <p className="text-muted">
        <TimeStamp originalDate={article.publicationDate} />
      </p>
    </div>
  );
};
