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

  const articleSlugs = [
    "arsenal-fc-22-23-premier-league-champions-or-back-to-back-season-choke-artists",
    "george-santos-serial-liar-and-us-representative",
    "the-golden-globes-return-from-previous-controversies-how-did-they-handle-it-who-were-the-winners",
    "how-controversial-is-too-controversial",
    "chatgpt-a-look-into-the-ai-taking-the-world-by-storm",
    "homecoming-lman-starts-2023-with-a-bang-",
    "mma-world-comes-to-a-halt-after-18-year-old-victoria-lees-death",
    "the-lman-bulls-are-making-waves",
    "the-grim-future-of-affirmative-action",
    "covid-19-its-not-over-just-yet",
    "the-fight-against-climate-change",
    "the-world-population-has-surpassed-8-billion-people-now-what",
    "the-giants-fall",
    "red-wave-hits-blue-wall----how-the-outcome-of-the-midterms-will-impact-the-us",
    "running-with-the-lady-bulls",
    "the-importance-of-having-a-health-class-in-high-school",
    "is-this-the-end-of-snl",
    "climate-activists-capture-the-worlds-attention-with-the-recent-attacks-on-art",
    "world-population-reaches-eight-billion-biden-announces-purge-to-control-overpopulation",
    "setting-our-sights-on-super-bowl-lvii",
    "leman-fall-sports-recap",
  ];

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
              <HomePageLarge
                latestArticles={latestArticles.content}
                slugs={articleSlugs}
              />
            </div>
            <div className="d-none d-sm-block d-lg-none">
              <HomePageMedium
                latestArticles={latestArticles.content}
                slugs={articleSlugs}
              />
            </div>
            <div className="d-sm-none">
              <HomePageSmall
                latestArticles={latestArticles.content}
                slugs={articleSlugs}
              />
            </div>
          </>
        )}
      </Container>
    </>
  );
};
