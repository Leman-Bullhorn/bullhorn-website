import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar";
import { getArticleBySlug } from "../api/requests";
import { IArticle, IApiError } from "../types";
import { VariableContainer } from "../components/variableContainer";
import styled from "styled-components";
import { Placeholder, Row } from "react-bootstrap";
import { HorizontalDivider } from "../components/horizontalDivider";
import { ThemedLink } from "../components/themedLink";
import { TimeStamp } from "../components/timeStamp";
import { HeadlineFont } from "../components/headlineFont";
import { useQuery } from "@tanstack/react-query";
import { TextPlaceholder } from "../components/textPlaceholder";

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
                <ThemedLink to={article.section.permalink}>
                  {article.section.name}
                </ThemedLink>
              </p>
              <HeadlineFont>
                <h1 className="text-center fw-bold">{article.headline}</h1>
              </HeadlineFont>
              <p className="lh-1">
                By{" "}
                <ThemedLink
                  className="fw-bold"
                  to={`/writer/${article.writer.firstName}-${article.writer.lastName}`}>
                  {article.writer.firstName} {article.writer.lastName}
                </ThemedLink>
              </p>
              <p className="text-muted">
                <TimeStamp originalDate={article.publicationDate} />
              </p>
            </Row>
            <StyledDivider />
            <Row style={{ fontFamily: "georgia", fontSize: "1.25rem" }}>
              <p>
                After two long years of face-coverings being a necessity at
                Léman, on Monday, March 14, the school moved to a mask-optional
                stance. This policy change followed new COVID-19 guidelines set
                by the CDC, which went into effect on February 25 on
                mask-wearing that take into account hospitalization, hospital
                capacity, and infection numbers.
              </p>
              <p>
                The CDC’s new metrics established three risk levels: low,
                medium, and high. For those living in low or medium-risk
                communities, the CDC no longer requires mask-wearing except for
                traveling by air, taxis or rideshare, and public transportation.
                The exception to this is people who are at risk because of
                factors such as preexisting conditions. Those who live in
                high-risk areas will still have to follow mask mandates. The
                result of the CDC’s categorization determined that 85% of the
                United States is low or medium risk and, therefore, by their new
                guidelines, no longer deem masks necessary in those areas.
              </p>
              <p>
                Although Léman is now mask-optional, it is important to still
                have a mask handy in case conditions change. The new guidelines
                establish COVID-19 community levels, which allow for more
                specific recommendations depending on the area's risk level. As
                CDC Director Rochelle Walensky says, they want to give people a
                break from mask-wearing, but “new risk guidelines that the
                agency is implementing will help people know when to reach for
                masks again if conditions warrant it.”
              </p>
              <p>
                The last time the CDC made such a dramatic change in masking
                guidelines was on May 18, 2021, when Walensky said, “Anyone who
                is fully vaccinated can participate in indoor and outdoor
                activities, large or small, without wearing a mask or physically
                distancing.” Shortly thereafter, the CDC regretted this decision
                in light of the surging Delta variant and quickly returned to
                their previous guidelines. This came as little surprise to many
                experts at the time who were highly critical of the CDC’s
                decision, such as Jeff Duchin, MD, who said, “I believe that we
                need more time to get disease rates down and vaccination rates
                up before doing anything that would weaken our indoor mask
                mandates.”
              </p>
              {/* {article.body} */}
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
