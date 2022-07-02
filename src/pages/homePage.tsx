import { useState } from "react";
import { Masthead } from "../components/mastHead";
import { Article } from "../components/article";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole, IApiError, IArticle, Paginated } from "../types";
import { current, getArticles } from "../api/requests";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const [isMastHeadVisible, setMastHeadVisible] = useState(true);

  const {
    data: articles,
    isLoading,
    isError,
    isIdle,
    error,
  } = useQuery<Paginated<IArticle[]>, IApiError, Paginated<IArticle[]>>(
    ["articles", 1],
    () => getArticles(1),
  );

  const { data: roleData } = useQuery("role", current);

  if (isError) {
    return <p>{error}</p>;
  }

  return (
    <>
      {roleData === AuthRole.Admin && <AdminPageButton />}
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />

      <Container>
        <Row>
          <Masthead changeVisibility={setMastHeadVisible} />
        </Row>
        {isLoading || isIdle ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Row xs={1} sm={1} md={2} lg={3} xl={3} xxl={3}>
            <Col className="featured-column">
              <Article {...articles.content[0]} />
            </Col>
            <Col>{/* <Article {...activeArticles[1]} /> */}</Col>
            <Col>{/* <Article {...activeArticles[2]} /> */}</Col>
          </Row>
        )}
      </Container>
    </>
  );
};
