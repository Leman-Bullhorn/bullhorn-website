import React, { useState } from "react";
import {
  Alert,
  Button,
  Form,
  Container,
  Card,
  Table,
  Col,
  Row,
} from "react-bootstrap";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import {
  getArticles,
  postArticle,
  getWriters,
  getSections,
} from "../api/requests";
import { IApiError, IArticle, ISection, IWriter, Paginated } from "../types";

export const AdminDashboard = () => {
  const [articleFormHeadline, setArticleFormHeadline] = useState("");
  const [articleFormContent, setArticleFormContent] = useState("");
  const [articleFormWriter, setArticleFormWriter] = useState<IWriter>();
  const [articleFormSection, setArticleFormSection] = useState<ISection>();

  const queryClient = useQueryClient();

  const {
    data: articleData,
    isError: isArticlesError,
    error: articleError,
  } = useInfiniteQuery<Paginated<IArticle[]>, IApiError, Paginated<IArticle[]>>(
    "articles",
    ({ pageParam = 1 }) => getArticles(pageParam),
    {
      getNextPageParam: lastPage => lastPage.next?.page,
      getPreviousPageParam: lastPage => lastPage.previous?.page,
    },
  );

  const {
    data: writerData,
    isError: isErrorWriters,
    error: writerError,
  } = useQuery<IWriter[], IApiError, IWriter[]>("writers", getWriters);

  const {
    data: sectionData,
    isError: isErrorSections,
    error: sectionError,
  } = useQuery<ISection[], IApiError, ISection[]>("sections", getSections);

  const articleMutation = useMutation(postArticle, {
    onSuccess() {
      queryClient.invalidateQueries("articles");
    },
  });

  const publishArticle = async () => {
    const writerId = articleFormWriter?.id;
    if (writerId === undefined) return;
    const sectionId = articleFormSection?.id;
    if (sectionId === undefined) return;

    articleMutation.mutate({
      headline: articleFormHeadline,
      body: articleFormContent,
      writerId,
      sectionId,
    });
  };

  const onChangeWriterSelection = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    let writerId = parseInt(event.target.value);

    const selectedWriter = writerData?.find(writer => writer.id === writerId);
    if (!selectedWriter) return;

    setArticleFormWriter(selectedWriter);
  };

  const onChangeSectionSelection = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    let sectionId = parseInt(event.target.value);

    const selectedSection = sectionData?.find(
      section => section.id === sectionId,
    );
    if (!selectedSection) return;

    console.log(selectedSection);

    setArticleFormSection(selectedSection);
  };

  const onClickEditArticle = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!articleData) return;

    const articleId = parseInt(event.currentTarget.id);

    for (const page of articleData.pages) {
      let maybeFoundArticle = page.content.find(
        article => article.id === articleId,
      );
      if (maybeFoundArticle) {
        return maybeFoundArticle;
      }
    }
  };

  if (isArticlesError) {
    return <h1>Error {articleError.message}</h1>;
  }

  if (isErrorWriters) {
    return <h1>Error {writerError.message}</h1>;
  }

  if (isErrorSections) {
    return <h1>Error {sectionError.message}</h1>;
  }

  return (
    <>
      <Container>
        <Row xs={2}>
          <Col className="overflow-scroll" style={{ height: "75vh" }}>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Headline</th>
                  <th>Section</th>
                  <th>Published</th>
                  <th>Author</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {articleData?.pages.map(page => (
                  <>
                    {page.content.map(article => (
                      <tr key={article.id}>
                        <td>{article.id}</td>
                        <td>{article.headline}</td>
                        <td>{article.section.name}</td>
                        <td>{article.publicationDate.toLocaleDateString()}</td>
                        <td>
                          {article.writer.firstName} {article.writer.lastName}
                        </td>
                        <td>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="green"
                            viewBox="0 0 16 16"
                            className="user-select-none"
                            style={{ cursor: "pointer" }}
                            id={article.id.toString()}
                            onClick={onClickEditArticle}>
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col>
            <Card>
              <Card.Header>
                <Card.Text>Create Article</Card.Text>
              </Card.Header>
              <Card.Body>
                <Form.FloatingLabel
                  className="mb-3"
                  controlId="headlineInput"
                  label="Headline">
                  <Form.Control
                    type="text"
                    required
                    placeholder="Enter Headline"
                    onChange={e => setArticleFormHeadline(e.target.value)}
                  />
                </Form.FloatingLabel>
                <Form.FloatingLabel
                  className="mb-3"
                  controlId="writerInput"
                  label="Writer">
                  <Form.Select required onChange={onChangeWriterSelection}>
                    {(writerData ?? []).map(writer => (
                      <option key={writer.id} value={writer.id.toString()}>
                        {writer.firstName} {writer.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.FloatingLabel>
                <Form.FloatingLabel
                  className="mb-3"
                  controlId="sectionInput"
                  label="Section">
                  <Form.Select required onChange={onChangeSectionSelection}>
                    {(sectionData ?? []).map(section => (
                      <option key={section.id} value={section.id.toString()}>
                        {section.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.FloatingLabel>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={e => setArticleFormContent(e.target.value)}
                />
                <br />
                {articleMutation.isError && (
                  <Alert variant="danger">Failed to publish article</Alert>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  onClick={publishArticle}
                  disabled={
                    articleFormHeadline === "" ||
                    articleFormContent === "" ||
                    articleFormSection === undefined ||
                    articleFormWriter === undefined
                  }>
                  Publish
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
