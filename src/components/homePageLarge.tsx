import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { getFeaturedArticle } from "../api/requests";
import { IApiError, IArticle } from "../types";
import { Article } from "./article";
import { FeaturedArticle } from "./featuredArticle";
import { HorizontalDivider } from "./horizontalDivider";

const BorderedCol = styled(Col)`
  border-right: 1px solid #dddddd;
`;

// const articleSlugs = [
//   "how-controversial-is-too-controversial",
//   "chatgpt-a-look-into-the-ai-taking-the-world-by-storm",
//   "homecoming-lman-starts-2023-with-a-bang-",
//   "mma-world-comes-to-a-halt-after-18-year-old-victoria-lees-death",
//   "the-lman-bulls-are-making-waves",
//   "the-grim-future-of-affirmative-action",
//   "covid-19-its-not-over-just-yet",
//   "the-fight-against-climate-change",
//   "the-world-population-has-surpassed-8-billion-people-now-what",
//   "the-giants-fall",
//   "red-wave-hits-blue-wall----how-the-outcome-of-the-midterms-will-impact-the-us",
//   "running-with-the-lady-bulls",
//   "the-importance-of-having-a-health-class-in-high-school",
//   "is-this-the-end-of-snl",
//   "climate-activists-capture-the-worlds-attention-with-the-recent-attacks-on-art",
//   "world-population-reaches-eight-billion-biden-announces-purge-to-control-overpopulation",
//   "setting-our-sights-on-super-bowl-lvii",
//   "leman-fall-sports-recap",
// ];

// const sideColumnSlugs = [
//   "arsenal-fc-22-23-premier-league-champions-or-back-to-back-season-choke-artists",
//   "george-santos-serial-liar-and-us-representative",
//   "the-golden-globes-return-from-previous-controversies-how-did-they-handle-it-who-were-the-winners",
// ];

export const HomePageLarge: React.FC<{
  latestArticles: IArticle[];
  slugs: string[];
}> = ({ latestArticles, slugs }) => {
  const { data: featuredArticle } = useQuery<IArticle, IApiError, IArticle>(
    ["articles", { featured: true }],
    () => getFeaturedArticle(),
  );

  const sideColumnSlugs = slugs.slice(undefined, 3);
  const articleSlugs = slugs.slice(3);

  return (
    <div>
      <Row>
        <Col
          lg={7}
          style={{
            paddingRight: "1rem",
            borderRight: "1px solid #dddddd",
          }}>
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}
          <div className="d-flex py-2">
            <Article
              style={{
                borderRight: "1px solid #dddddd",
                borderBottom: "none",
              }}
              article={
                latestArticles.find(
                  article => article.slug === articleSlugs[0],
                )!
              }
            />

            <Article
              style={{ borderBottom: "none" }}
              article={
                latestArticles.find(
                  article => article.slug === articleSlugs[1],
                )!
              }
            />
          </div>
        </Col>

        <Col lg={5}>
          <p className="mb-0">Latest</p>
          <HorizontalDivider />

          {[0, 1, 2].map(idx => (
            <Article
              article={
                latestArticles.find(
                  ({ slug }) => slug === sideColumnSlugs[idx],
                )!
              }
            />
          ))}
        </Col>
      </Row>

      <HorizontalDivider />

      <Row className="pt-2">
        <BorderedCol>
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[2])!
            }
          />

          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(article => article.slug === articleSlugs[5])!
            }
          />
        </BorderedCol>
        <BorderedCol>
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[3])!
            }
          />
          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(article => article.slug === articleSlugs[6])!
            }
          />
        </BorderedCol>
        <Col>
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[7])!
            }
          />
          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(article => article.slug === articleSlugs[4])!
            }
          />
        </Col>
      </Row>
    </div>
  );
};
