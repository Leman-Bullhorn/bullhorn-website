import { Link, useParams } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar";
import { getArticleBySlug } from "../api/requests";
import { IArticle, IApiError, sections } from "../types";
import { VariableContainer } from "../components/variableContainer";
import styled from "styled-components";
import { Placeholder, Row } from "react-bootstrap";
import { HorizontalDivider } from "../components/horizontalDivider";
import { ThemedLink, ThemedAnchor } from "../components/themedLink";
import { TimeStamp } from "../components/timeStamp";
import { useQuery } from "@tanstack/react-query";
import { TextPlaceholder } from "../components/textPlaceholder";
import { ArticleHeadline } from "../components/articleHeadline";
import { SectionFont } from "../components/sectionFont";

const ArticleLink = styled(ThemedAnchor)`
  display: inline;
`;

const StyledContainer = styled(VariableContainer)`
  margin-top: 50px;
`;

const StyledDivider = styled(HorizontalDivider)`
  margin-bottom: 20px;
`;

const BlackDivider = styled(HorizontalDivider)`
  border-bottom: 1px solid black;
`;

export const ArticlePage = () => {
  const { slug } = useParams();

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery<IArticle, IApiError, IArticle>(["articles", slug!], () =>
    getArticleBySlug(slug!),
  );

  if (isError) {
    return <p>Error loading article: {error.message}</p>;
  }

  return (
    <>
      <NavigationBar />
      <StyledContainer fluid="lg" xl={1066}>
        <BlackDivider />
        {isLoading ? (
          <ArticlePagePlaceholder />
        ) : (
          <>
            <Row>
              <p className="text-uppercase" style={{ fontSize: "0.8rem" }}>
                <ThemedLink to={`/section/${article.section}`}>
                  <SectionFont>
                    {sections.find(section => section.id === article.section)
                      ?.display ?? article.section}
                  </SectionFont>
                </ThemedLink>
              </p>
              <ArticleHeadline>{article.headline}</ArticleHeadline>
              <div className="d-flex">
                <p className="mb-0">
                  By{" "}
                  <ThemedLink
                    className="fw-bold"
                    to={`/writer/${article.writer.firstName}-${article.writer.lastName}`}>
                    {article.writer.firstName} {article.writer.lastName}
                  </ThemedLink>
                </p>

                {article.writer.imageUrl && (
                  <Link
                    style={{ marginLeft: "0.4rem", lineHeight: "1" }}
                    to={`/writer/${article.writer.firstName}-${article.writer.lastName}`}>
                    <img
                      className="rounded-circle"
                      alt=""
                      src={article.writer.imageUrl}
                      width={24}
                      height={24}
                    />
                  </Link>
                )}
              </div>
              <p className="text-muted">
                <TimeStamp originalDate={article.publicationDate} />
              </p>
            </Row>
            <StyledDivider />
            <Row
              style={{
                fontFamily: "georgia",
                fontSize: "1.25rem",
                maxWidth: "70ch",
                margin: "0 auto",
              }}>
              {article.imageUrl && (
                <img
                  alt=""
                  src={article.imageUrl}
                  className="w-50"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              )}
              {article.content.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  style={{
                    marginLeft: paragraph.marginLeft,
                    marginRight: paragraph.marginRight,
                    textAlign: paragraph.textAlignment,
                    textIndent: paragraph.textIndent,
                  }}>
                  {paragraph.spans.map((span, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontStyle: span.fontStyle,
                        textDecoration: span.textDecoration,
                        color: span.color,
                        fontWeight: span.fontWeight,
                      }}>
                      {span.content.map((content, idx) => {
                        if ("anchor" in content) {
                          return (
                            <ArticleLink
                              key={idx}
                              href={content.anchor.href}
                              dangerouslySetInnerHTML={{
                                __html: content.anchor.content,
                              }}
                              rel="noreferrer"
                              target="_blank"
                            />
                          );
                        } else if ("image" in content) {
                          return (
                            <img
                              src={content.image.src}
                              alt={content.image.alt}
                              width={content.image.width}
                              height={content.image.height}
                            />
                          );
                        } else {
                          return (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: content.text.content,
                              }}
                            />
                          );
                        }
                      })}
                    </span>
                  ))}
                </p>
              ))}
            </Row>
          </>
        )}
      </StyledContainer>
    </>
  );
};

const ArticlePagePlaceholder = () => {
  return (
    <>
      <Row>
        <Placeholder as="p" animation="glow" size="sm">
          <TextPlaceholder xs={1} />
        </Placeholder>
        <Placeholder as="h1" animation="glow" className="text-center" size="lg">
          <TextPlaceholder xs={8} />
        </Placeholder>
        <Placeholder as="p" animation="glow">
          <TextPlaceholder xs={1} />
          <br />
          <TextPlaceholder xs={2} />
        </Placeholder>
      </Row>
      <StyledDivider />
      <Row style={{ fontSize: "1.25rem" }}>
        {Array.from(Array(6).keys()).map(idx => (
          <Placeholder as="p" animation="glow" key={idx}>
            {Array.from(Array(Math.floor(Math.random() * 4) + 2).keys()).map(
              (idx, _, { length }) => (
                <TextPlaceholder
                  key={idx}
                  xs={
                    idx !== length - 1
                      ? Math.floor(Math.random() * 3) + 10
                      : Math.floor(Math.random() * 4) + 1
                  }
                />
              ),
            )}
          </Placeholder>
        ))}
      </Row>
    </>
  );
};
