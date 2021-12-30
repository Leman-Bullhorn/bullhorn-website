import { useState } from "react";
import MastHead from "../components/mastHead";
import Article from "../components/article";
import { Container, Row, Col } from "react-bootstrap";
import articleStore from "../stores/articleStore";
import NavigationBar from "../components/navigationBar";

const HomePage = () => {
  const [isMastHeadVisible, setMastHeadVisible] = useState(true);

  return (
    <>
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />
      <Container>
        <Row>
          <MastHead changeVisibility={setMastHeadVisible} />
        </Row>

        <Row>
          <Col className="featured-column" lg={5} md={7}>
            <Article
              {...(articleStore
                .getArticles()
                .filter(article => article.featured)[0] ??
                articleStore.getArticles()[0])}
            />
            {/* <Article {...articleStore.getArticles()[0]} /> */}
          </Col>
          <Col>
            <Article {...articleStore.getArticles()[1]} />
            <Article {...articleStore.getArticles()[2]} />
            <Article {...articleStore.getArticles()[1]} />
            <Article {...articleStore.getArticles()[1]} />
            <Article {...articleStore.getArticles()[1]} />
          </Col>
          <Col className="opinion-column">
            {articleStore
              .getArticles()
              .filter(article => article.section.name === "Opinions")
              .map(article => (
                <Article {...article} key={article.headline} />
              ))}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default HomePage;
