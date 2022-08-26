import { Container, Button, Row, Placeholder } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar";
import { getWriterByName, getArticlesByWriterId } from "../api/requests";
import { IApiError, IArticle, IWriter } from "../types";
import styled from "styled-components";
import {
  ArticleBlock,
  ArticleBlockPlaceholder,
} from "../components/articleBlock";
import { HeadlineFont } from "../components/headlineFont";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TextPlaceholder } from "../components/textPlaceholder";

const BioContainer = styled(Container)`
  margin-top: 50px;
  border-bottom: 1px solid
    rgba(${({ theme }) => theme.lemanColorComponents}, 0.4);
`;

const BorderedDiv = styled.div`
  border-right: 1px solid #dddddd;
  padding-right: 50px;
`;

export function WriterPage() {
  const { writerName } = useParams();

  const queryClient = useQueryClient();

  const {
    data: writer,
    isLoading: isWriterLoading,
    isError: isWriterError,
    error: writerError,
  } = useQuery<IWriter, IApiError, IWriter>(["writers", writerName!], () =>
    getWriterByName(writerName!),
  );

  const {
    data: recentArticles,
    isLoading: isArticleLoading,
    isError: isArticleError,
    error: articleError,
  } = useQuery<IArticle[], IApiError, IArticle[]>(
    ["articles", writer?.id],
    () => getArticlesByWriterId(writer!.id),
    { enabled: writer !== undefined },
  );

  if (isWriterError) {
    return <p>Error {writerError.message}</p>;
  }

  if (isArticleError) {
    return <p>Error {articleError.message}</p>;
  }

  const articlesOrSkeleton = isArticleLoading
    ? Array.from(Array(3).keys()).map(idx => (
        <Row key={idx.toString()}>
          <ArticleBlockPlaceholder />
        </Row>
      ))
    : recentArticles.map(article => (
        <Row key={`${article.id}`}>
          <ArticleBlock {...article} />
        </Row>
      ));

  return (
    <>
      <NavigationBar />
      <BioContainer>
        <HeadlineFont>
          {isWriterLoading ? (
            <>
              <Placeholder animation="glow" as="h5">
                <TextPlaceholder xs={2} />
              </Placeholder>
              <Placeholder animation="glow" as="h1">
                <TextPlaceholder xs={4} />
              </Placeholder>
            </>
          ) : (
            <>
              <h5 className="lh-1 fw-lighter text-start">{writer.title}</h5>
              <h1 className="lh-1 fw-bolder text-start">
                {writer.firstName} {writer.lastName}
              </h1>
            </>
          )}
        </HeadlineFont>
        <br />
        {isWriterLoading ? (
          <Placeholder animation="glow" as="p">
            <TextPlaceholder xs={7} />
          </Placeholder>
        ) : (
          <p className="text-muted fw-light text-wrap w-75">{writer.bio}</p>
        )}
      </BioContainer>
      <Container>
        <Row>
          {isArticleLoading ? (
            <Placeholder animation="glow" as="p">
              <TextPlaceholder xs={1} />
            </Placeholder>
          ) : (
            <p>Recent Articles</p>
          )}
        </Row>

        {/* hide on screens smaller than than md */}
        <BorderedDiv style={{ maxWidth: "70%" }} className="d-none d-md-block">
          {articlesOrSkeleton}
        </BorderedDiv>
        {/* hide on screens larger than or equal to md */}
        <BorderedDiv className="d-md-none">{articlesOrSkeleton}</BorderedDiv>

        <Row>
          <Button
            onClick={() =>
              writer && queryClient.invalidateQueries(["articles", writer.id])
            }
            variant="outline-primary"
            size="lg">
            Show More
          </Button>
        </Row>
      </Container>
    </>
  );
}
