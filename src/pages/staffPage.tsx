import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { HeadlineFont } from "../components/headlineFont";
import { NavigationBar } from "../components/navigationBar";

const CenteredP = styled.p`
  text-align: center;
  margin-bottom: 0;
`;

const Title = styled(CenteredP)`
  margin-bottom: 0rem;
  font-weight: 700;
  font-size: 1.25rem;
`;

const Column = styled(Col)`
  padding: 0;
`;

export const StaffPage = () => {
  return (
    <>
      <NavigationBar />
      <Container>
        <HeadlineFont>
          <h1 className="text-center mt-4 fs-1">Staff</h1>

          <h3 className="text-center mt-2 mb-4">
            Members of the 2022-23 Bullhorn team
          </h3>

          <Row xs={3}>
            <Column style={{ marginLeft: "16.6667%" }}>
              <Title>Content Engineer</Title>
              <CenteredP>Max Glass</CenteredP>
            </Column>
            <Column>
              <Title>Managing Editor</Title>
              <CenteredP>Danae Kosta</CenteredP>
            </Column>
          </Row>

          <Row className="mt-2">
            <Column>
              <Title>News</Title>
              <CenteredP>Brandon Curo</CenteredP>
              <CenteredP>Ember Pires</CenteredP>
              <CenteredP>Zander Sargeant</CenteredP>
              <CenteredP>Didem Harris</CenteredP>
              <CenteredP>Blair Walsh</CenteredP>
              <CenteredP>Renata Bellizia Glori</CenteredP>
              <CenteredP>Genevieve Shilibo</CenteredP>
              <CenteredP>Sofia Doucette</CenteredP>
            </Column>
            <Column>
              <Title>Opinions</Title>
              <CenteredP>Tabbie Brovner</CenteredP>
              <CenteredP>Caelyn Osbern</CenteredP>
              <CenteredP>Sofia Zullo</CenteredP>
              <CenteredP>Charli Reda</CenteredP>
            </Column>
            <Column>
              <Title>Features</Title>
              <CenteredP>Sara Sajjad</CenteredP>
              <CenteredP>Lina Ytuarte</CenteredP>
              <CenteredP>Lev Feldsher</CenteredP>
              <CenteredP>Renata Bellizia Glori</CenteredP>
            </Column>
          </Row>

          <Row className="mt-2">
            <Column>
              <Title>Science</Title>
              <CenteredP>Saahil Suri</CenteredP>
              <CenteredP>Jasper Dratt</CenteredP>
              <CenteredP>Quinn Peacock</CenteredP>
              <CenteredP>Joseph Pazmino Larco</CenteredP>
            </Column>
            <Column>
              <Title>Sports</Title>
              <CenteredP>Jotham Kriakos</CenteredP>
              <CenteredP>Lucas Forwood</CenteredP>
              <CenteredP>Paloma Alonso</CenteredP>
              <CenteredP>Samir Saleh</CenteredP>
              <CenteredP>Julian Burdess</CenteredP>
              <CenteredP>Eliana Friedman</CenteredP>
            </Column>
            <Column>
              <Title>Arts & Entertainment</Title>
              <CenteredP>Ruby McGrath</CenteredP>
              <CenteredP>Victoria Cornet</CenteredP>
              <CenteredP>Flavia Mezzari</CenteredP>
              <CenteredP>Fernanda Sieber </CenteredP>
              <CenteredP>Sade Modeste</CenteredP>
              <CenteredP>Genevieve Shibilo</CenteredP>
            </Column>
          </Row>

          <Row className="mt-2">
            <Column>
              <Title>Humor</Title>
              <CenteredP>Frederick Buford</CenteredP>
            </Column>
          </Row>

          <Row className="mt-4">
            <Column>
              <Title>Managing Arts Director</Title>
              <CenteredP>Colin Grant</CenteredP>
            </Column>
          </Row>

          <Row xs={3}>
            <Column style={{ marginLeft: "16.6667%" }}>
              <Title>Photography</Title>
              <CenteredP>Yotam Le Pape</CenteredP>
              <CenteredP>Lili Sposato</CenteredP>
            </Column>
            <Column>
              <Title>Art & Design</Title>
              <CenteredP>Charles Longsworth</CenteredP>
              <CenteredP>Samia Perez</CenteredP>
              <CenteredP>Maya Jess</CenteredP>
              <CenteredP>Camila Passos</CenteredP>
              <CenteredP>River An</CenteredP>
            </Column>
          </Row>
        </HeadlineFont>
      </Container>
    </>
  );
};
