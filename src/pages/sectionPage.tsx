import { useQuery } from "@tanstack/react-query";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getArticlesBySection } from "../api/requests";
import {
  ArticleBlock,
  ArticleBlockPlaceholder,
} from "../components/articleBlock";
import { HorizontalDivider } from "../components/horizontalDivider";
import { NavigationBar } from "../components/navigationBar";
import { SectionFont } from "../components/sectionFont";
import { IApiError, IArticle, Paginated, Section, sections } from "../types";

const BorderedDiv = styled.div`
  border-right: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
  padding-right: 50px;
  padding-left: 50px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h1`
  font-size: 4rem;
  text-align: center;
`;

const SectionPageContent: React.FC<{
  section: {
    id: Section;
    display: string;
  };
}> = ({ section }) => {
  const {
    data: sectionArticles,
    isLoading,
    isError,
    error,
  } = useQuery<Paginated<IArticle[]>, IApiError, Paginated<IArticle[]>>(
    ["articles", { paginated: true, section: section.id }, 1],
    () => getArticlesBySection(section.id, 1, 50),
  );

  if (isError) {
    return <p>Error {error.message}</p>;
  }

  const articlesOrSkeleton = isLoading
    ? Array.from(Array(3).keys()).map(idx => (
        <Row key={idx.toString()}>
          <ArticleBlockPlaceholder />
        </Row>
      ))
    : sectionArticles.content.map(article => (
        <Row key={`${article.id}`}>
          <ArticleBlock {...article} />
        </Row>
      ));

  return (
    <>
      <NavigationBar />
      <Container className="mt-4" fluid>
        <SectionFont>
          <SectionTitle>{section.display}</SectionTitle>
        </SectionFont>

        <HorizontalDivider
          className="mb-5 d-none d-lg-block mx-auto"
          style={{ maxWidth: "85%" }}
        />
        <HorizontalDivider className="d-lg-none mx-auto mb-5" />

        {sectionArticles?.content.length === 0 && (
          <h3 className="text-center">No articles here yet...</h3>
        )}

        {/* hide on screens smaller than than lg */}
        <BorderedDiv style={{ maxWidth: "70%" }} className="d-none d-lg-block">
          {articlesOrSkeleton}
        </BorderedDiv>
        {/* hide on screens larger than or equal to lg */}
        <BorderedDiv className="d-lg-none">{articlesOrSkeleton}</BorderedDiv>
      </Container>
    </>
  );
};

export const SectionPage = () => {
  const { sectionId } = useParams();

  const foundSection = sections.find(s => s.id === sectionId);

  if (foundSection == null) return <></>;
  return <SectionPageContent section={foundSection} />;
};
