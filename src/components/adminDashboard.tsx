import React, { useMemo, useState } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";
import { Column, useTable, useSortBy } from "react-table";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getArticles,
  postArticle,
  getWriters,
  getSections,
} from "../api/requests";
import { IApiError, IArticle, ISection, IWriter, Paginated } from "../types";
import { DriveTable } from "./driveTable";

export const AdminDashboard = () => {
  const {
    data: articleData,
    isError: isArticlesError,
    error: articleError,
    fetchNextPage: fetchNextArticlePage,
    hasNextPage: hasNextArticlePage,
  } = useInfiniteQuery<Paginated<IArticle[]>, IApiError, Paginated<IArticle[]>>(
    ["paginatedArticles"],
    ({ pageParam = 1 }) => getArticles(pageParam, 20),
    {
      getNextPageParam: lastPage => lastPage.next?.page,
      getPreviousPageParam: lastPage => lastPage.previous?.page,
      refetchOnWindowFocus: false,
    },
  );

  if (isArticlesError) {
    return <h1>Error {articleError.message}</h1>;
  }

  const articles = (articleData?.pages ?? []).flatMap(it => it.content);

  return (
    <>
      <Container>
        <Row xs={2}>
          <Col
            id="articles-table"
            className="overflow-scroll"
            style={{ height: "75vh" }}>
            <InfiniteScroll
              dataLength={articles.length}
              next={fetchNextArticlePage}
              hasMore={hasNextArticlePage ?? false}
              loader={<span>Loading...</span>}
              scrollableTarget="articles-table">
              <ArticlesTable articles={articles} />
            </InfiniteScroll>
          </Col>
          <Col>
            <ArticleCreationForm />
          </Col>
        </Row>
        <Row>
          <DriveTable />
        </Row>
      </Container>
    </>
  );
};

interface ArticlesTableProps {
  articles: IArticle[];
}

const ArticlesTable = ({ articles }: ArticlesTableProps) => {
  const onClickEditArticle = (event: React.MouseEvent<SVGSVGElement>) => {
    const articleId = parseInt(event.currentTarget.id);

    return articles.find(article => article.id === articleId);
  };

  const articleTableData = useMemo(
    () =>
      articles.map(article => ({
        id: article.id.toString(),
        headline: article.headline,
        section: article.section.name,
        published: article.publicationDate.toLocaleDateString(),
        author: `${article.writer.firstName} ${article.writer.lastName}`,
      })),
    [articles],
  );

  const articleTableColumns: Column<typeof articleTableData[0]>[] = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Headline",
        accessor: "headline",
      },
      {
        Header: "Section",
        accessor: "section",
      },
      {
        Header: "Published",
        accessor: "published",
      },
      {
        Header: "Author",
        accessor: "author",
      },
    ],
    [],
  );

  const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } =
    useTable(
      {
        data: articleTableData,
        columns: articleTableColumns,
      },
      useSortBy,
    );

  return (
    <Table striped bordered hover {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                title={
                  (column.isSorted as boolean)
                    ? (column.isSortedDesc as boolean)
                      ? "Sort initial"
                      : "Sort descending"
                    : "Sort ascending"
                }>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                  {column.render("Header")}
                  <svg
                    style={{
                      width: "1em",
                      height: "1em",
                      alignSelf: "center",
                    }}
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                    {(column.isSorted as boolean) ? (
                      (column.isSortedDesc as boolean) ? (
                        <>
                          <path d="M793.853319 552.682561 233.488799 552.682561c-15.776312 0-30.063713 9.402137-36.300764 23.908526-6.257517 14.547321-3.305279 31.376615 7.528464 42.905182l280.183284 256.19801c7.471159 7.930623 17.878183 12.417821 28.768207 12.417821 10.891048 0 21.298072-4.486174 28.773324-12.417821l280.179191-256.19801c10.832719-11.527544 13.790074-28.357861 7.532557-42.905182C823.917032 562.084699 809.629631 552.682561 793.853319 552.682561z" />
                        </>
                      ) : (
                        <>
                          <path d="M233.092779 473.447962l560.364521 0c0.289596-0.036839 0.518816-0.036839 0.788969 0 21.841447 0 39.547715-17.718547 39.547715-39.615253 0-12.96222-6.219655-24.449855-15.817244-31.688723L542.045293 150.419871c-14.94641-15.862269-42.59819-15.862269-57.541531 0L204.320479 406.634254c-10.832719 11.527544-13.784958 28.357861-7.528464 42.905182C203.028043 464.045825 217.315444 473.447962 233.092779 473.447962z" />
                        </>
                      )
                    ) : (
                      <>
                        <path d="M233.092779 473.447962l560.364521 0c0.289596-0.036839 0.518816-0.036839 0.788969 0 21.841447 0 39.547715-17.718547 39.547715-39.615253 0-12.96222-6.219655-24.449855-15.817244-31.688723L542.045293 150.419871c-14.94641-15.862269-42.59819-15.862269-57.541531 0L204.320479 406.634254c-10.832719 11.527544-13.784958 28.357861-7.528464 42.905182C203.028043 464.045825 217.315444 473.447962 233.092779 473.447962z" />
                        <path d="M793.853319 552.682561 233.488799 552.682561c-15.776312 0-30.063713 9.402137-36.300764 23.908526-6.257517 14.547321-3.305279 31.376615 7.528464 42.905182l280.183284 256.19801c7.471159 7.930623 17.878183 12.417821 28.768207 12.417821 10.891048 0 21.298072-4.486174 28.773324-12.417821l280.179191-256.19801c10.832719-11.527544 13.790074-28.357861 7.532557-42.905182C823.917032 562.084699 809.629631 552.682561 793.853319 552.682561z" />
                      </>
                    )}
                  </svg>
                </div>
              </th>
            ))}
            <th>Edit</th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
              <td>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="green"
                  viewBox="0 0 16 16"
                  className="user-select-none"
                  style={{ cursor: "pointer" }}
                  id={row.allCells[0].value}
                  onClick={onClickEditArticle}>
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                </svg>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

const ArticleCreationForm = () => {
  const [articleFormHeadline, setArticleFormHeadline] = useState("");
  const [articleFormContent, setArticleFormContent] = useState("");
  const [articleFormWriter, setArticleFormWriter] = useState<IWriter>();
  const [articleFormSection, setArticleFormSection] = useState<ISection>();

  const queryClient = useQueryClient();

  const {
    data: writerData,
    isError: isErrorWriters,
    error: writerError,
  } = useQuery<IWriter[], IApiError, IWriter[]>(["writers"], getWriters);

  const {
    data: sectionData,
    isError: isErrorSections,
    error: sectionError,
  } = useQuery<ISection[], IApiError, ISection[]>(["sections"], getSections);

  const articleMutation = useMutation(postArticle, {
    onSuccess() {
      queryClient.invalidateQueries(["articles"]);
    },
  });

  if (isErrorWriters) {
    return <h1>Error {writerError.message}</h1>;
  }

  if (isErrorSections) {
    return <h1>Error {sectionError.message}</h1>;
  }

  const publishArticle = async () => {
    const writerId = articleFormWriter?.id;
    if (writerId === undefined) return;
    const sectionId = articleFormSection?.id;
    if (sectionId === undefined) return;

    // Escape the string
    let body = JSON.parse(JSON.stringify(articleFormContent));

    articleMutation.mutate({
      headline: articleFormHeadline,
      body,
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

  return (
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setArticleFormHeadline(e.target.value)
            }
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
  );
};
