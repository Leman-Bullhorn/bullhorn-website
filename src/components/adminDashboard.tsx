import { Container, Col, Row, Tab, Nav } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getArticles, getArticleSubmissions } from "../api/requests";
import { ArticleSubmission, IApiError, IArticle, Paginated } from "../types";
import { WritersTable } from "./writersTable";
import { ArticlesTable } from "./articlesTable";
import { CreateWriter } from "./createWriter";
import { ArticleSubmissionsTable } from "./articleSubmissionsTable";

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

  const { data: articleSubmissions } = useQuery<
    ArticleSubmission[],
    IApiError,
    ArticleSubmission[]
  >(["submissions"], getArticleSubmissions);

  if (isArticlesError) {
    return <h1>Error {articleError.message}</h1>;
  }

  const articles = (articleData?.pages ?? []).flatMap(it => it.content);

  return (
    <Tab.Container defaultActiveKey="article">
      <div className="d-flex">
        <Col sm={2} style={{ borderRight: "1px solid #dddddd" }}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="article">Articles</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="writer">Writer</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="submissions">
                Article Submissions{" "}
                {articleSubmissions ? `(${articleSubmissions.length})` : ""}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="content">Content</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={10} style={{ height: "75vh" }}>
          <Tab.Content>
            <Tab.Pane eventKey="article">
              <Container>
                <InfiniteScroll
                  dataLength={articles.length}
                  next={fetchNextArticlePage}
                  hasMore={hasNextArticlePage ?? false}
                  loader={<span>Loading...</span>}
                  scrollableTarget="articles-table">
                  <ArticlesTable articles={articles} />
                </InfiniteScroll>
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
            <Tab.Pane eventKey="submissions">
              <Container>
                <ArticleSubmissionsTable />
              </Container>
            </Tab.Pane>
            <Tab.Pane eventKey="content">
              <Container>
                <p>hi</p>
              </Container>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </div>
    </Tab.Container>
  );
};
