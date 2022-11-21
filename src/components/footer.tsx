import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Nav, Row } from "react-bootstrap";
import styled from "styled-components";
import { HorizontalDivider } from "./horizontalDivider";
import { ThemedLink } from "./themedLink";

const BrandText = styled.p`
  margin: 0;
  padding: 0;
  font-family: Amador;
  font-size: 30px;
`;

const StyledA = styled.a`
  color: black;
  text-decoration: none;
  margin-left: 0;
  margin-right: 0;

  :hover {
    color: rgb(${({ theme }) => theme.lemanColorComponents});
    text-decoration: underline;
  }
`;

export const Footer = () => (
  <Container as="footer" style={{ marginTop: "5rem", marginBottom: "2rem" }}>
    <HorizontalDivider style={{ marginBottom: "0.25rem" }} />
    <Nav as="ul" className="flex-grow-1 flex-shrink-0">
      <HorizontalDivider />
      <Nav.Item>
        <BrandText>The Bullhorn</BrandText>
      </Nav.Item>
      <Nav.Item className="mx-2 my-auto">
        <a
          href="https://www.instagram.com/lemanbullhorn/"
          rel="noreferrer"
          target="_blank">
          <FontAwesomeIcon
            icon={faInstagram}
            size="2x"
            style={{ color: "black" }}
          />
        </a>
      </Nav.Item>
    </Nav>
    <Row style={{ marginTop: "2rem" }}>
      <Col>
        <b>
          <p className="mb-0">About</p>
        </b>
        <StyledA
          rel="noreferrer"
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSc13tr2WnpnlHdH88S3kwveNed-g178mZN8W6377T5vZXMVTQ/viewform">
          Suggestions
        </StyledA>
        <br />
        <StyledA
          rel="noreferrer"
          target="_blank"
          href="https://forms.gle/Vk1wBTRvKeKd9gUb6">
          Join
        </StyledA>
        <br />
        <ThemedLink to="/staff">Staff</ThemedLink>
      </Col>
      <Col>
        <b>
          <ThemedLink to="/section/news">News</ThemedLink>
        </b>
      </Col>
      <Col>
        <b>
          <ThemedLink to="/section/opinions">Opinions</ThemedLink>
        </b>
      </Col>
      <Col>
        <b>
          <ThemedLink to="/section/features">Features</ThemedLink>
        </b>
      </Col>
      <Col>
        <b>
          <ThemedLink to="/section/science">Science</ThemedLink>
        </b>
      </Col>
      <Col>
        <b>
          <ThemedLink to="/section/sports">Sports</ThemedLink>
        </b>
      </Col>
      <Col>
        <b>
          <ThemedLink to="/section/arts">A & E</ThemedLink>
        </b>
      </Col>
      <Col>
        <b>
          <ThemedLink to="/section/humor">Humor</ThemedLink>
        </b>
      </Col>
    </Row>
    <Row>
      <span className="text-center">
        &copy; {new Date().getFullYear()} The Bullhorn
      </span>
    </Row>
  </Container>
);
