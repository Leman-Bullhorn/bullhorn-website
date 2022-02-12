import { useEffect, useState } from "react";
import { Masthead } from "../components/mastHead";
import { Article } from "../components/article";
import { Container, Row, Col } from "react-bootstrap";
import { NavigationBar } from "../components/navigationBar";
import { IArticle } from "../types";
import { getArticles } from "../api/wrapper";

export const HomePage = () => {
  const [isMastHeadVisible, setMastHeadVisible] = useState(true);
  const [activeArticles, setActiveArticles] = useState<IArticle[]>([]);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    void (async function () {
      let articles = await getArticles();
      console.log(articles);
      if (articles.length === 0) {
        setError(true);
      }
      setActiveArticles(articles);
      setLoading(false);
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  if (isError) {
    return <p>Network issue!</p>;
  }

  // This should eventually either render a spinner or a skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />
      <Container>
        <Row>
          <Masthead changeVisibility={setMastHeadVisible} />
        </Row>
        <Row xs={1} sm={1} md={2} lg={3} xl={3} xxl={3}>
          <Col className="featured-column">
            <Article {...activeArticles[0]} />
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
