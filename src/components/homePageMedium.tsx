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

export const HomePageMedium: React.FC<{
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
        <BorderedCol>
          <Article
            article={latestArticles.find(article => article.slug === slugs[0])!}
          />
          <Article
            article={latestArticles.find(article => article.slug === slugs[2])!}
          />
          <Article
            article={latestArticles.find(article => article.slug === slugs[4])!}
          />
          <Article
            article={latestArticles.find(article => article.slug === slugs[6])!}
          />
          <Article
            article={latestArticles.find(article => article.slug === slugs[8])!}
          />
          <Article
            style={{ borderBottom: "none" }}
            article={
              latestArticles.find(article => article.slug === slugs[10])!
            }
          />
        </BorderedCol>
        <Col>
          <Article
            article={latestArticles.find(article => article.slug === slugs[1])!}
          />
          <Article
            article={latestArticles.find(article => article.slug === slugs[3])!}
          />
          <Article
            article={latestArticles.find(article => article.slug === slugs[5])!}
          />
          <Article
            article={latestArticles.find(article => article.slug === slugs[7])!}
          />
          <Article
            style={{ borderBottom: "none" }}
            article={latestArticles.find(article => article.slug === slugs[9])!}
          />
        </Col>
      </Row>
    </div>
  );
};
