import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar";
import { getArticleBySlug } from "../api/requests";
import { IArticle, IApiError } from "../types";
import { VariableContainer } from "../components/variableContainer";
import styled from "styled-components";
import { Row } from "react-bootstrap";
import { HorizontalDivider } from "../components/horizontalDivider";
import { ThemedLink } from "../components/themedLink";
import { TimeStamp } from "../components/timeStamp";
import { HeadlineFont } from "../components/headlineFont";
import { useQuery } from "react-query";

const StyledContainer = styled(VariableContainer)`
  margin-top: 50px;
`;

const StyledDivider = styled(HorizontalDivider)`
  margin-bottom: 20px;
`;

const BlackDivider = styled(HorizontalDivider)`
  border-bottom: 1px solid black;
`;

export const ArticlePage = () => {
  const { slug } = useParams();

  const {
    data: article,
    isSuccess: articleLoaded,
    isLoading: articleLoading,
    isError: isArticleError,
    error: articleError,
  } = useQuery<IArticle, IApiError, IArticle>(["articles", slug!], () =>
    getArticleBySlug(slug!),
  );

  if (isArticleError) {
    return <p>Error loading article: {articleError.message}</p>;
  }

  if (articleLoading || !articleLoaded) {
    return <p>Loading...</p>;
  }

  const writerUrl = `/writer/${article.writer.firstName}-${article.writer.lastName}`;

  return (
    <>
      <NavigationBar />
      <StyledContainer fluid="lg" xl={1066}>
        <BlackDivider />
        <Row>
          <p className="text-uppercase" style={{ fontSize: "0.8rem" }}>
            <ThemedLink to={article.section.permalink}>
              {article.section.name}
            </ThemedLink>
          </p>
          <HeadlineFont>
            <h1 className="text-center fw-bold">{article.headline}</h1>
          </HeadlineFont>
          <p className="lh-1">
            By{" "}
            <ThemedLink className="fw-bold" to={writerUrl}>
              {article.writer.firstName} {article.writer.lastName}
            </ThemedLink>
          </p>
          <p className="text-muted">
            <TimeStamp originalDate={article.publicationDate} />
          </p>
        </Row>
        <StyledDivider />
        <Row style={{ fontFamily: "georgia", fontSize: "1.25rem" }}>
          {article.body}
        </Row>
      </StyledContainer>
    </>
  );
};
