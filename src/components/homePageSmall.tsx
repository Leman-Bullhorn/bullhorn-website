import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { getFeaturedArticle } from "../api/requests";
import { IApiError, IArticle } from "../types";
import { Article } from "./article";
import { FeaturedArticle } from "./featuredArticle";

const articleSlugs = [
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

export const HomePageSmall: React.FC<{ latestArticles: IArticle[] }> = ({
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
        <Col>
          {articleSlugs.map((slug, idx, { length }) => (
            <Article
              style={idx === length - 1 ? { borderBottom: "none" } : undefined}
              article={latestArticles.find(article => article.slug === slug)!}
            />
          ))}
        </Col>
      </Row>
    </div>
  );
};
