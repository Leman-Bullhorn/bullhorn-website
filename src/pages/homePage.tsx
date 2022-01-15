import { useEffect, useState } from "react";
import MastHead from "../components/mastHead";
import Article from "../components/article";
import { Container, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/navigationBar";
import { IArticle } from "../types";
import { getArticles } from "../api/requests";

const HomePage = () => {
  const [isMastHeadVisible, setMastHeadVisible] = useState(true);
  const [activeArticles, setActiveArticles] = useState<IArticle[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    void (async function () {
      try {
        let articles = await getArticles();
        console.log(articles);
        setActiveArticles(articles);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  if (activeArticles.length === 0) {
    return <></>;
  }

  return (
    <>
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />
      <Container>
        <Row>
          <MastHead changeVisibility={setMastHeadVisible} />
        </Row>

        <Row xs={1} sm={1} md={2} lg={3} xl={3} xxl={3}>
          <Col className="featured-column">
            <Article {...activeArticles[0]} />
          </Col>
          <Col>
            <Article {...activeArticles[1]} />
          </Col>
          <Col>
            <Article {...activeArticles[2]} />
          </Col>

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
export default HomePage;
