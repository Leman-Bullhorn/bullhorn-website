import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Button,
  Form,
  Spinner,
  Container,
  Card,
  Table,
  Col,
  Row,
} from "react-bootstrap";
import { getSections, getWriters, login } from "../api/wrapper";
import { current, getArticles, postArticle } from "../api/requests";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole, IArticle, ISection, IWriter } from "../types";

export const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [writers, setWriters] = useState<IWriter[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);
  const [articleFormHeadline, setArticleFormHeadline] = useState("");
  const [articleFormWriter, setArticleFormWriter] = useState<IWriter>();
  const [articleFormSection, setArticleFormSection] = useState<ISection>();
  const [articleFormContent, setArticleFormContent] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    void (async function () {
      let role = await current();

      setAdmin(role === AuthRole.Admin);

      setArticles(await getArticles(9999999));

      setWriters(await getWriters());

      setSections(await getSections());
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  const publishArticle = useCallback(async () => {
    const writerId = articleFormWriter?.id;
    if (writerId === undefined) return;
    const sectionId = articleFormSection?.id;
    if (sectionId === undefined) return;

    try {
      await postArticle(
        articleFormHeadline,
        articleFormContent,
        writerId,
        sectionId,
      );
    } catch (e) {
      console.log(e);
      console.log("failed to publish article");
    }
  }, [
    articleFormContent,
    articleFormHeadline,
    articleFormSection,
    articleFormWriter,
  ]);

  const onClickEditArticle = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const articleId = parseInt(event.currentTarget.id);

      const selectedArticle = articles.find(
        article => article.id === articleId,
      );
      if (!selectedArticle) return;

      console.log(selectedArticle);
    },
    [articles],
  );

  const onChangeHeadlineForm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setArticleFormHeadline(event.target.value);
    },
    [],
  );

  const onChangeWriterSelection = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      let writerId = parseInt(event.target.value);

      const selectedWriter = writers.find(writer => writer.id === writerId);
      if (!selectedWriter) return;

      setArticleFormWriter(selectedWriter);
    },
    [writers],
  );

  const onChangeSectionSelection = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      let sectionId = parseInt(event.target.value);

      const selectedSection = sections.find(
        section => section.id === sectionId,
      );
      if (!selectedSection) return;

      console.log(selectedSection);

      setArticleFormSection(selectedSection);
    },
    [sections],
  );

  const onChangeContentForm = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setArticleFormContent(event.target.value);
    },
    [],
  );

  const onChangeUsername = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    },
    [],
  );

  const onChangePassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [],
  );

  const onSubmit = async () => {
    setLoading(true);
    try {
      let role = await login(username, password);
      let administrator = role === AuthRole.Admin;
      setAdmin(administrator);
      setError(!administrator);
    } catch (e) {
      setError(true);
      setAdmin(false);
    }
    setLoading(false);
  };

  if (isAdmin) {
    return (
      <>
        <NavigationBar />
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
                  {articles.map(article => (
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
                      placeholder="Enter Headline"
                      onChange={onChangeHeadlineForm}
                    />
                  </Form.FloatingLabel>
                  <Form.FloatingLabel
                    className="mb-3"
                    controlId="writerInput"
                    label="Writer">
                    <Form.Select onChange={onChangeWriterSelection}>
                      {writers.map(writer => (
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
                    <Form.Select onChange={onChangeSectionSelection}>
                      {sections.map(section => (
                        <option key={section.id} value={section.id.toString()}>
                          {section.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.FloatingLabel>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={onChangeContentForm}
                  />
                  <br />
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
  } else {
    return (
      <>
        <NavigationBar buffer={false} />
        <Container className="d-flex vh-100 justify-content-center align-items-center">
          <Card style={{ width: "50vw" }}>
            <Card.Header>
              <Card.Text>Login</Card.Text>
            </Card.Header>
            <Card.Body>
              <Form.FloatingLabel
                className="mb-3"
                controlId="formUsername"
                label="Username">
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  onChange={onChangeUsername}
                />
              </Form.FloatingLabel>

              <Form.FloatingLabel
                className="mb-3"
                controlId="formPassword"
                label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={onChangePassword}
                />
              </Form.FloatingLabel>

              {isError && <Alert variant="danger">Login Failed</Alert>}

              <Button
                variant="primary"
                type="submit"
                onClick={onSubmit}
                disabled={username === "" || password === "" || isLoading}>
                {isLoading && (
                  <>
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    Loading...
                  </>
                )}
                {!isLoading && "Submit"}
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
};
