import { useState, useEffect, useCallback } from "react";
import { Container, Button, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import NavigationBar from "../components/navigationBar";
import writerStore from "../stores/writerStore";
import { getWriterByName, getArticlesByWriterId } from "../api/requests";
import { IArticle, IWriter } from "../types";
import styled from "styled-components";
import articleStore from "../stores/articleStore";
import { ArticleBlock } from "../components/articleBlock";
import { HeadlineFont } from "../components/headlineFont";

const BioContainer = styled(Container)`
  margin-top: 50px;
  border-bottom: 1px solid
    rgba(${({ theme }) => theme.lemanColorComponents}, 0.4);
`;

const BorderedDiv = styled.div`
  border-right: 1px solid #dddddd;
  padding-right: 50px;
`;

export default function WriterPage() {
  const { writerName } = useParams();
  const [isError, setError] = useState(false);
  const [activeWriter, setActiveWriter] = useState<IWriter>({
    id: -1,
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
  });
  const [recentArticles, setRecentArticles] = useState<IArticle[]>([]);

  const updateRecentArticles = useCallback(async () => {
    if (activeWriter.id === -1) return;
    const tempWriterArticles = articleStore
      .getArticles()
      .filter(article => article.writer.id === activeWriter.id);

    // If we have more articles in the cache then just use those.
    if (tempWriterArticles.length > recentArticles.length) {
      setRecentArticles(tempWriterArticles);
      // Otherwise try to get new articles from the API.
    } else {
      try {
        let articles = await getArticlesByWriterId(activeWriter.id);
        if (articles.length === recentArticles.length) return;

        for (const article of articles) {
          if (
            !articleStore
              .getArticles()
              .some(storeArticle => storeArticle.id === article.id)
          ) {
            articleStore.addArticle(article);
          }
        }

        setRecentArticles(articles);
      } catch (e) {
        setError(true);
        console.log(e);
      }
    }
  }, [activeWriter.id, recentArticles.length]);

  useEffect(() => {
    const abortController = new AbortController();
    void (async function () {
      const tempWriter = writerStore
        .getWriters()
        .find(
          writer => writerName === `${writer.firstName}-${writer.lastName}`,
        );

      if (tempWriter) {
        setActiveWriter(tempWriter);
      } else {
        // If we don't have the writer in the store, request it.
        try {
          const writer = await getWriterByName(writerName!);
          writerStore.addWriter(writer);
          setActiveWriter(writer);
        } catch (e) {
          setError(true);
          console.log(e);
        }
      }
    })();

    return () => {
      abortController.abort(); // cancel pending fetch request on component unmount
    };
  }, [writerName]);

  useEffect(() => {
    const abortController = new AbortController();
    updateRecentArticles();

    return () => {
      abortController.abort();
    };
  }, [activeWriter, updateRecentArticles]);

  if (isError) {
    return (
      <div>
        <NavigationBar />
        Error!
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <BioContainer>
        <HeadlineFont>
          <h5 className="lh-1 fw-lighter text-start">{activeWriter.title}</h5>
          <h1 className="lh-1 fw-bolder text-start">
            {activeWriter.firstName} {activeWriter.lastName}
          </h1>
        </HeadlineFont>
        <br />
        <p className="text-muted fw-light text-wrap w-75">{activeWriter.bio}</p>
      </BioContainer>
      <Container>
        <Row>
          <p>Recent Articles</p>
        </Row>

        {/* hide on screens smaller than than md */}
        <BorderedDiv style={{ maxWidth: "70%" }} className="d-none d-md-block">
          {recentArticles.map(article => (
            <Row key={`${article.id}`}>
              <ArticleBlock {...article} />
            </Row>
          ))}
        </BorderedDiv>
        {/* hide on screens larger than or equal to md */}
        <BorderedDiv className="d-md-none">
          {recentArticles.map(article => (
            <Row key={`${article.id}`}>
              <ArticleBlock {...article} />
            </Row>
          ))}
        </BorderedDiv>

        <Row>
          <Button
            onClick={updateRecentArticles}
            variant="outline-primary"
            size="lg">
            Show More
          </Button>
        </Row>
      </Container>
    </>
  );
}
