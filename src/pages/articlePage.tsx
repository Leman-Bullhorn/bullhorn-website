import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navigationBar";
import { sectionsStore } from "../stores/sectionStore";
import { getSections, getArticleBySlug } from "../api/requests";
import { ISection, IArticle } from "../types";
import { articleStore } from "../stores/articleStore";
import { VariableContainer } from "../components/variableContainer";
import styled from "styled-components";
import { Row } from "react-bootstrap";
import { HorizontalDivider } from "../components/horizontalDivider";
import { ThemedLink } from "../components/themedLink";
import { TimeStamp } from "../components/timeStamp";
import { HeadlineFont } from "../components/headlineFont";

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
  const { section, slug } = useParams();
  const [isError, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<ISection>();
  const [activeArticle, setActiveArticle] = useState<IArticle>();

  useEffect(() => {
    // Sanity check
    if (section === undefined || slug === undefined) {
      setError(true);
      return;
    }

    const abortController = new AbortController();
    void (async function () {
      let foundSection = sectionsStore
        .getSections()
        .find(({ name }) => name.toLowerCase() === section);

      if (foundSection !== undefined) {
        setActiveSection(foundSection);
      } else {
        const newSections = await getSections();
        foundSection = newSections.find(
          ({ name }) => name.toLowerCase() === section,
        );

        if (foundSection === undefined) {
          setError(true);
        } else {
          setActiveSection(foundSection);
          sectionsStore.setSections(newSections);
        }
      }

      let foundArticle = articleStore
        .getArticles()
        .find(
          article =>
            article.slug === slug &&
            article.section.name.toLowerCase() === section,
        );

      if (foundArticle !== undefined) {
        setActiveArticle(foundArticle);
      } else {
        foundArticle = await getArticleBySlug(slug);

        if (foundArticle === undefined) {
          setError(true);
        } else {
          setActiveArticle(foundArticle);
          articleStore.addArticle(foundArticle);
        }
      }
    })();

    return () => {
      abortController.abort(); // cancel pending fetch request on component unmount
    };
  }, [section, slug]);

  if (isError || activeArticle === undefined || activeSection === undefined) {
    return <p>Network Error!</p>;
  }

  const writerUrl = `/writer/${activeArticle.writer.firstName}-${activeArticle.writer.lastName}`;

  return (
    <>
      <NavigationBar />
      <StyledContainer fluid="lg" xl={1066}>
        <BlackDivider />
        <Row>
          <p className="text-uppercase" style={{ fontSize: "0.8rem" }}>
            <ThemedLink to={activeArticle.section.permalink}>
              {activeArticle.section.name}
            </ThemedLink>
          </p>
          <HeadlineFont>
            <h1 className="text-center fw-bold">{activeArticle.headline}</h1>
          </HeadlineFont>
          <p className="lh-1">
            By{" "}
            <ThemedLink className="fw-bold" to={writerUrl}>
              {activeArticle.writer.firstName} {activeArticle.writer.lastName}
            </ThemedLink>
          </p>
          <p className="text-muted">
            <TimeStamp originalDate={activeArticle.publicationDate} />
          </p>
        </Row>
        <StyledDivider />
        <Row style={{ fontFamily: "georgia", fontSize: "1.25rem" }}>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum
            facilis eligendi aliquid quae nesciunt placeat consequatur cumque
            tenetur. Iure maiores ducimus eveniet sint cum ea accusamus repellat
            delectus doloribus corporis, veritatis temporibus placeat quam
            maxime fugiat deleniti provident quisquam atque repudiandae voluptas
            error. Mollitia voluptatem vel ex a debitis itaque aperiam
            exercitationem qui ea. Pariatur ipsum placeat voluptatibus! Fuga
            qui, dolorum ex consequuntur alias tempora maiores magnam quisquam
            quam natus id rerum sit reprehenderit. Veniam minus eum repellendus
            eos dolor adipisci, tenetur, consectetur ea voluptatem quam ipsam
            cupiditate animi illum asperiores! Explicabo incidunt similique
            quia. Qui veritatis corporis nostrum at!
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
            a magni quia. Eveniet, quam expedita earum perferendis consequatur
            quia repellendus, fugiat quaerat libero ad eum atque, reprehenderit
            accusantium eaque maiores quis! Molestiae, voluptates impedit
            tempore iste dolores repellat inventore, hic accusamus ut adipisci
            laboriosam voluptas, animi consequatur odio illo eaque.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
            a magni quia. Eveniet, quam expedita earum perferendis consequatur
            quia repellendus, fugiat quaerat libero ad eum atque, reprehenderit
            accusantium eaque maiores quis! Molestiae, voluptates impedit
            tempore iste dolores repellat inventore, hic accusamus ut adipisci
            laboriosam voluptas, animi consequatur odio illo eaque.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
            a magni quia. Eveniet, quam expedita earum perferendis consequatur
            quia repellendus, fugiat quaerat libero ad eum atque, reprehenderit
            accusantium eaque maiores quis! Molestiae, voluptates impedit
            tempore iste dolores repellat inventore, hic accusamus ut adipisci
            laboriosam voluptas, animi consequatur odio illo eaque.
          </p>
          {activeArticle.body}
        </Row>
      </StyledContainer>
    </>
  );
};
