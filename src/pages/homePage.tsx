import { useState } from "react";
import { Masthead } from "../components/mastHead";
import { Article } from "../components/article";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole, IApiError, IArticle } from "../types";
import { current, getArticles } from "../api/requests";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const [isMastHeadVisible, setMastHeadVisible] = useState(true);

  const {
    data: articles,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<IArticle[], IApiError, IArticle[]>("articles", () =>
    getArticles(),
  );

  const { data: roleData } = useQuery("role", current);

  if (isError) {
    return <p>Network issue!</p>;
  }

  // This should eventually either render a spinner or a skeleton
  if (isLoading || !isSuccess) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {roleData === AuthRole.Admin && (
        <Link
          to={"/admin"}
          style={{ position: "absolute", margin: "5px", zIndex: 1 }}>
          <Button as="p">Admin Page</Button>
        </Link>
      )}
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />
      <Container>
        <Row>
          <Masthead changeVisibility={setMastHeadVisible} />
        </Row>
        <Row xs={1} sm={1} md={2} lg={3} xl={3} xxl={3}>
          <Col className="featured-column">
            <Article {...articles[0]} />
          </Col>
          <Col>{/* <Article {...activeArticles[1]} /> */}</Col>
          <Col>{/* <Article {...activeArticles[2]} /> */}</Col>

          {/* <Col className="opinion-column">
            {articleStore
              .getArticles()
              .filter(article => article.section?.name === "Opinions")
              .map(article => (
                <Article {...article} key={article.headline} />
              ))}
          </Col> */}
        </Row>
      </Container>
    </>
  );
};
