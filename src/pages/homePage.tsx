import { useState } from "react";
import { Masthead } from "../components/mastHead";
import { Article } from "../components/article";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole, IApiError, IArticle, Paginated } from "../types";
import { current, getArticles, getFeaturedArticle } from "../api/requests";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { HorizontalDivider } from "../components/horizontalDivider";
import { AdminPageButton } from "../components/adminPageButton";
import { FeaturedArticle } from "../components/featuredArticle";

const Styles = styled.div`
  .featured-section {
    padding-right: 18px;
    border-right: 1px solid #dddddd;
  }

  .featured-columns {
    padding-right: 10px;
  }

  .left-featured {
    padding-right: 18px;
    border-right: 1px solid #dddddd;
  }

  .right-featured {
    padding-left: 18px;
  }
`;

export const HomePage = () => {
  const [isMastHeadVisible, setMastHeadVisible] = useState(true);

  const {
    data: latestArticles,
    isLoading,
    isError,
    error,
  } = useQuery<Paginated<IArticle[]>, IApiError, Paginated<IArticle[]>>(
    ["articles", { paginated: true }, 1],
    () => getArticles(1, 50),
  );

  const { data: featuredArticle } = useQuery<IArticle, IApiError, IArticle>(
    ["articles", { featured: true }],
    () => getFeaturedArticle(),
  );

  const { data: roleData } = useQuery(["role"], current);

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      {roleData === AuthRole.Admin && <AdminPageButton />}
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />

      <Container>
        <Row className="mb-4">
          <Masthead changeVisibility={setMastHeadVisible} />
        </Row>
        {isLoading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Styles>
            <Row>
              <Col
                xs={12}
                md={8}
                style={{
                  paddingRight: "1rem",
                  borderRight: "1px solid #dddddd",
                }}>
                {featuredArticle && (
                  <FeaturedArticle article={featuredArticle} />
                )}
              </Col>

              <Col>
                <p className="mb-0">Latest</p>
                <HorizontalDivider />
                {latestArticles.content
                  .filter(article => !article.featured)
                  .slice(0, 3)
                  .map(article => (
                    <Article article={article} />
                  ))}
              </Col>
            </Row>
          </Styles>
        )}
      </Container>
    </>
  );
};
