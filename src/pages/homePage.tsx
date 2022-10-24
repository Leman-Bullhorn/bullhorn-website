import { useState } from "react";
import { Masthead } from "../components/mastHead";
import { Article } from "../components/article";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole, IApiError, IArticle, Paginated } from "../types";
import { current, getArticles } from "../api/requests";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { HorizontalDivider } from "../components/horizontalDivider";
import { AdminPageButton } from "../components/adminPageButton";

const Styles = styled.div`
  .featured-section {
    padding-right: 18px;
    border-right: 1px solid #dddddd;
  }

  .featured-columns {
    padding-top: 10px;
    padding-right: 10px;
  }

  .left-featured {
    padding-right: 18px;
    border-right: 1px solid #dddddd;
  }

  .right-featured {
    padding-left: 18px;
  }
`;

export const HomePage = () => {
  const [isMastHeadVisible, setMastHeadVisible] = useState(true);

  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useQuery<Paginated<IArticle[]>, IApiError, Paginated<IArticle[]>>(
    ["articles", { paginated: true }, 1],
    () => getArticles(1, 50),
  );

  const { data: roleData } = useQuery(["role"], current);

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      {roleData === AuthRole.Admin && <AdminPageButton />}
      <NavigationBar visible={!isMastHeadVisible} buffer={false} />

      <Container>
        <Row>
          <Masthead changeVisibility={setMastHeadVisible} />
        </Row>
        {isLoading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Styles>
            {/* <Row> */}
            <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
              <Container
                fluid
                className="featured-section"
                style={{ border: "0px red solid" }}>
                <Row>
                  <h3>News</h3>
                  <HorizontalDivider />
                </Row>
                <Row className="featured-columns">
                  <Col xs={7} className="left-featured">
                    {articles.content.length === 0 ? (
                      <p>no articles</p>
                    ) : (
                      <Article {...articles.content[0]} />
                    )}

                    {/* <Article {...articles.content[2]} />
                    <Article {...articles.content[4]} />
                    <Article {...articles.content[6]} />
                  </Col>
                  <Col className="right-featured">
                    <Article {...articles.content[1]} />
                    <Article {...articles.content[3]} />
                    <Article {...articles.content[5]} />
                    <Article {...articles.content[7]} /> */}
                  </Col>
                </Row>
              </Container>
            </Col>

            <Col>{/* <Article {...activeArticles[2]} /> */}</Col>
            {/* </Row> */}
          </Styles>
        )}
      </Container>
    </>
  );
};
