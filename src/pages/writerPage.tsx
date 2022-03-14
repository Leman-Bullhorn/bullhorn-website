import { Container, Button, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar";
import { getWriterByName, getArticlesByWriterId } from "../api/requests";
import { IApiError, IArticle, IWriter } from "../types";
import styled from "styled-components";
import { ArticleBlock } from "../components/articleBlock";
import { HeadlineFont } from "../components/headlineFont";
import { useQuery, useQueryClient } from "react-query";

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
    isLoading: loadingWriter,
    isError: isWriterError,
    isSuccess: isWriterSuccess,
    error: writerError,
  } = useQuery<IWriter, IApiError, IWriter>(["writers", writerName!], () =>
    getWriterByName(writerName!),
  );

  const {
    data: recentArticles,
    isLoading: loadingArticles,
    isError: isArticleError,
    isSuccess: isArticleSuccess,
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

  if (!isWriterSuccess || loadingWriter) {
    return <p>Loading</p>;
  }

  if (loadingArticles || !isArticleSuccess) {
    return <p>Loading Articles</p>;
  }

  return (
    <>
      <NavigationBar />
      <BioContainer>
        <HeadlineFont>
          <h5 className="lh-1 fw-lighter text-start">{writer.title}</h5>
          <h1 className="lh-1 fw-bolder text-start">
            {writer.firstName} {writer.lastName}
          </h1>
        </HeadlineFont>
        <br />
        <p className="text-muted fw-light text-wrap w-75">{writer.bio}</p>
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
            onClick={() =>
              queryClient.invalidateQueries(["articles", writer.id])
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
