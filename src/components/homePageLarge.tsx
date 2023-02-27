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
          {articleSlugs
            .slice(2)
            .map((slug, idx) =>
              idx % 3 === 0 ? (
                <Article
                  key={slug}
                  style={
                    idx + 3 > articleSlugs.length - 1
                      ? { borderBottom: "none" }
                      : undefined
                  }
                  article={
                    latestArticles.find(article => article.slug === slug)!
                  }
                />
              ) : null,
            )}
        </BorderedCol>
        <BorderedCol>
          {articleSlugs
            .slice(2)
            .map((slug, idx) =>
              idx % 3 === 1 ? (
                <Article
                  key={slug}
                  style={
                    idx + 3 > articleSlugs.length - 1
                      ? { borderBottom: "none" }
                      : undefined
                  }
                  article={
                    latestArticles.find(article => article.slug === slug)!
                  }
                />
              ) : null,
            )}
        </BorderedCol>

        <Col>
          {articleSlugs
            .slice(2)
            .map((slug, idx) =>
              idx % 3 === 2 ? (
                <Article
                  key={slug}
                  style={
                    idx + 3 > articleSlugs.length - 1
                      ? { borderBottom: "none" }
                      : undefined
                  }
                  article={
                    latestArticles.find(article => article.slug === slug)!
                  }
                />
              ) : null,
            )}
        </Col>
      </Row>
    </div>
  );
};
