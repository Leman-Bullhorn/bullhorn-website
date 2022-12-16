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

const articleSlugs = [
  "the-fight-against-climate-change",
  "the-world-population-has-surpassed-8-billion-people-now-what",
  "red-wave-hits-blue-wall----how-the-outcome-of-the-midterms-will-impact-the-us",
  "running-with-the-lady-bulls",
  "is-this-the-end-of-snl",
  "climate-activists-capture-the-worlds-attention-with-the-recent-attacks-on-art",
  "world-population-reaches-eight-billion-biden-announces-purge-to-control-overpopulation",
  "leman-fall-sports-recap",
];

export const HomePageLarge: React.FC<{ latestArticles: IArticle[] }> = ({
  latestArticles,
}) => {
  const { data: featuredArticle } = useQuery<IArticle, IApiError, IArticle>(
    ["articles", { featured: true }],
    () => getFeaturedArticle(),
  );

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
          {latestArticles
            .filter(article => !article.featured)
            .slice(0, 3)
            .map(article => (
              <Article article={article} key={article.id} />
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
