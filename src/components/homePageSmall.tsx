import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { getFeaturedArticle } from "../api/requests";
import { IApiError, IArticle } from "../types";
import { Article } from "./article";
import { FeaturedArticle } from "./featuredArticle";

export const HomePageSmall: React.FC<{
  latestArticles: IArticle[];
  slugs: string[];
}> = ({ latestArticles, slugs }) => {
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
          {slugs.map((slug, idx, { length }) => (
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
