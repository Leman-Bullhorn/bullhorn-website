import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar";
import { getArticleBySlug } from "../api/requests";
import { IArticle, IApiError } from "../types";
import { VariableContainer } from "../components/variableContainer";
import styled from "styled-components";
import { Placeholder, Row } from "react-bootstrap";
import { HorizontalDivider } from "../components/horizontalDivider";
import { ThemedLink } from "../components/themedLink";
import { TimeStamp } from "../components/timeStamp";
import { HeadlineFont } from "../components/headlineFont";
import { useQuery } from "react-query";
import { TextPlaceholder } from "../components/textPlaceholder";

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
    isIdle,
    isLoading,
    isError,
    error,
  } = useQuery<IArticle, IApiError, IArticle>(["articles", slug!], () =>
    getArticleBySlug(slug!),
  );

  if (isError) {
    return <p>Error loading article: {error.message}</p>;
  }

  return (
    <>
      <NavigationBar />
      <StyledContainer fluid="lg" xl={1066}>
        <BlackDivider />
        {isLoading || isIdle ? (
          <ArticlePagePlaceholder />
        ) : (
          <>
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
                <ThemedLink
                  className="fw-bold"
                  to={`/writer/${article.writer.firstName}-${article.writer.lastName}`}>
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
          </>
        )}
      </StyledContainer>
    </>
  );
};

const ArticlePagePlaceholder = () => {
  return (
    <>
      <Row>
        <Placeholder as="p" animation="glow" size="sm">
          <TextPlaceholder xs={1} />
        </Placeholder>
        <Placeholder as="h1" animation="glow" className="text-center" size="lg">
          <TextPlaceholder xs={8} />
        </Placeholder>
        <Placeholder as="p" animation="glow">
          <TextPlaceholder xs={1} />
          <br />
          <TextPlaceholder xs={2} />
        </Placeholder>
      </Row>
      <StyledDivider />
      <Row style={{ fontSize: "1.25rem" }}>
        {Array.from(Array(6).keys()).map(idx => (
          <Placeholder as="p" animation="glow" key={idx}>
            {Array.from(Array(Math.floor(Math.random() * 4) + 2).keys()).map(
              (idx, _, { length }) => (
                <TextPlaceholder
                  key={idx}
                  xs={
                    idx !== length - 1
                      ? Math.floor(Math.random() * 3) + 10
                      : Math.floor(Math.random() * 4) + 1
                  }
                />
              ),
            )}
          </Placeholder>
        ))}
      </Row>
    </>
  );
};
