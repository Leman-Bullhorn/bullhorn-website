import { useState } from "react";
import { Masthead } from "../components/mastHead";
import { Container, Row, Spinner } from "react-bootstrap";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole, IApiError, IArticle, Paginated } from "../types";
import { current, getArticles } from "../api/requests";
import { useQuery } from "@tanstack/react-query";
import { AdminPageButton } from "../components/adminPageButton";
import { HomePageLarge } from "../components/homePageLarge";
import { HomePageMedium } from "../components/homePageMedium";
import { HomePageSmall } from "../components/homePageSmall";

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

  const { data: roleData } = useQuery(["role"], current);

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      {roleData === AuthRole.Admin && <AdminPageButton />}
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />
      <div className="d-sm-none">
        <NavigationBar buffer />
      </div>

      <Container>
        <div className="d-none d-sm-block">
          <Row className="mb-4">
            <Masthead changeVisibility={setMastHeadVisible} />
          </Row>
        </div>
        {isLoading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <>
            <div className="d-none d-lg-block">
              <HomePageLarge latestArticles={latestArticles.content} />
            </div>
            <div className="d-none d-sm-block d-lg-none">
              <HomePageMedium latestArticles={latestArticles.content} />
            </div>
            <div className="d-sm-none">
              <HomePageSmall latestArticles={latestArticles.content} />
            </div>
          </>
        )}
      </Container>
    </>
  );
};
