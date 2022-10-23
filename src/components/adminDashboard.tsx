import { Container, Col, Row, Tab, Nav } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getArticles } from "../api/requests";
import { IApiError, IArticle, Paginated } from "../types";
import { DriveTable } from "./driveTable";
import { WritersTable } from "./writersTable";
import { ArticlesTable } from "./articlesTable";
import { CreateWriter } from "./createWriter";

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
    <Tab.Container defaultActiveKey="article">
      <div className="d-flex">
        <Col sm={1} style={{ borderRight: "1px solid #dddddd" }}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="article">Article</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="writer">Writer</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={11} style={{ height: "75vh" }}>
          <Tab.Content>
            <Tab.Pane eventKey="article">
              <Container>
                <Row xs={2}>
                  <Col id="articles-table" className="overflow-scroll">
                    <InfiniteScroll
                      dataLength={articles.length}
                      next={fetchNextArticlePage}
                      hasMore={hasNextArticlePage ?? false}
                      loader={<span>Loading...</span>}
                      scrollableTarget="articles-table">
                      <ArticlesTable articles={articles} />
                    </InfiniteScroll>
                  </Col>
                  <Col>
                    <DriveTable />
                  </Col>
                </Row>
              </Container>
            </Tab.Pane>
            <Tab.Pane eventKey="writer">
              <Container>
                <Row xs={2}>
                  <Col>
                    <WritersTable />
                  </Col>
                  <Col>
                    <CreateWriter />
                  </Col>
                </Row>
              </Container>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </div>
    </Tab.Container>
  );
};
