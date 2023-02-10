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

const articleSlugs = [
  "george-santos-serial-liar-and-us-representative",
  "the-importance-of-having-a-health-class-in-high-school",
  "chatgpt-a-look-into-the-ai-taking-the-world-by-storm",
  "the-giants-fall",
  "homecoming-lman-starts-2023-with-a-bang-",
  "mma-world-comes-to-a-halt-after-18-year-old-victoria-lees-death",
  "the-lman-bulls-are-making-waves",
  "the-grim-future-of-affirmative-action",
  "covid-19-its-not-over-just-yet",
  "lman-celebrates-lunar-new-year-the-celebration-of-the-rabbit",
  "us-river-heat-waves-becoming-more-frequent-threatening-safety-of-river-based-ecosystems",
  "us-world-cup-convictions-crushed",
  "bad-blood-taylor-swift--the-ticketmaster-fiasco",
  "the-fight-against-climate-change",
  "the-world-population-has-surpassed-8-billion-people-now-what",
  "red-wave-hits-blue-wall----how-the-outcome-of-the-midterms-will-impact-the-us",
  "running-with-the-lady-bulls",
  "is-this-the-end-of-snl",
  "climate-activists-capture-the-worlds-attention-with-the-recent-attacks-on-art",
  "world-population-reaches-eight-billion-biden-announces-purge-to-control-overpopulation",
  "leman-fall-sports-recap",
];

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
              latestArticles.find(article => article.slug === articleSlugs[0])!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[2])!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[4])!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[6])!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[8])!
            }
          />
          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(article => article.slug === articleSlugs[10])!
            }
          />
        </BorderedCol>
        <Col>
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[1])!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[3])!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[5])!
            }
          />
          <Article
            article={
              latestArticles.find(article => article.slug === articleSlugs[7])!
            }
          />
          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(article => article.slug === articleSlugs[9])!
            }
          />
        </Col>
      </Row>
    </div>
  );
};
