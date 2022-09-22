import { Container, Col, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getArticles } from "../api/requests";
import { IApiError, IArticle, Paginated } from "../types";
import { DriveTable } from "./driveTable";
import { WritersTable } from "./writersTable";
import { ArticlesTable } from "./articlesTable";

export const AdminDashboard = () => {
  const {
    data: articleData,
    isError: isArticlesError,
    error: articleError,
    fetchNextPage: fetchNextArticlePage,
    hasNextPage: hasNextArticlePage,
  } = useInfiniteQuery<Paginated<IArticle[]>, IApiError, Paginated<IArticle[]>>(
    ["articles"],
    ({ pageParam = 1 }) => getArticles(pageParam, 20),
    {
      getNextPageParam: lastPage => lastPage.next?.page,
      getPreviousPageParam: lastPage => lastPage.previous?.page,
      refetchOnWindowFocus: false,
    },
  );

  if (isArticlesError) {
    return <h1>Error {articleError.message}</h1>;
  }

  const articles = (articleData?.pages ?? []).flatMap(it => it.content);

  return (
    <>
      <Container>
        <Row xs={2}>
          <Col
            id="articles-table"
            className="overflow-scroll"
            style={{ height: "75vh" }}>
            <InfiniteScroll
              dataLength={articles.length}
              next={fetchNextArticlePage}
              hasMore={hasNextArticlePage ?? false}
              loader={<span>Loading...</span>}
              scrollableTarget="articles-table">
              <ArticlesTable articles={articles} />
            </InfiniteScroll>
          </Col>
        </Row>
        <Row>
          <DriveTable />
          <WritersTable />
        </Row>
      </Container>
    </>
  );
};
