import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { getFeaturedArticle } from "../api/requests";
import { IApiError, IArticle } from "../types";
import { Article } from "./article";
import { FeaturedArticle } from "./featuredArticle";

const BorderedCol = styled(Col)`
  border-right: 1px solid #dddddd;
`;

export const HomePageMedium: React.FC<{ latestArticles: IArticle[] }> = ({
  latestArticles,
}) => {
  const { data: featuredArticle } = useQuery<IArticle, IApiError, IArticle>(
    ["articles", { featured: true }],
    () => getFeaturedArticle(),
  );

  return (
    <div>
      <Row>
        <Col>
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}
        </Col>
      </Row>

      <Row className="pt-2">
        <BorderedCol>
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "hurricane-fiona-and-what-3-clubs-are-doing-about-it",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "iranian-protests-focus-on-women-life-and-freedom",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "new-year-new-administration-dean-miller-and-dr-leonardatos-join-the-leman-community",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "lman-uniform-policy-inspires-unity-as-well-as-criticism",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === "student-voices")!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "new-student-run-clubs-how-leadership-is-demonstrated-at-lman",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article => article.slug === "giants-contenders-or-pretenders",
              )!
            }
          />
          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "drive-to-survive-has-taken-the-hearts-of-americans",
              )!
            }
          />
        </BorderedCol>
        <Col>
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "what-is-the-fourth-of-july-to-a-ten-year-old-in-ohio",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "tension-in-most-recent-brazilian-presidential-election",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "the-problem-driving-the-us-crazy-unstable-gas-prices",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "its-time-to-bereal-how-a-relatively-simple-concept-is-taking-social-media-by-storm",
              )!
            }
          />
          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "was-2022-the-year-for-horror-and-thriller-movies",
              )!
            }
          />

          <Article
            article={
              latestArticles.find(
                article =>
                  article.slug ===
                  "new-photos-from-the-james-webb-space-telescope",
              )!
            }
          />
          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(
                article =>
                  article.slug === "are-we-in-bella-hadids-golden-age-",
              )!
            }
          />
        </Col>
      </Row>
    </div>
  );
};
