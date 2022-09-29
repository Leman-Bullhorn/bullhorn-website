import { Navbar, Nav, Container, Col } from "react-bootstrap";
import styled from "styled-components";
import { LinkContainer } from "./linkContainer";
import { sections } from "../types";

const StyledNavbar = styled(Navbar)`
  transition-property: all;
  transition-duration: 0.25s;
  transition-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  transition-delay: 0s;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.28);
  padding-bottom: 0px;
  padding-top: 0px;
  flex-wrap: wrap;

  &.styled-nav-visible {
    visibility: visible;
    transform: translateY(0px);
  }

  &.styled-nav-hidden {
    visibility: hidden;
    transform: translateY(-100%);
  }
`;

const StyledBullhornText = styled.p`
  font-family: "amador";
  font-size: 30px;
  margin-bottom: 0;
  line-height: 0.8;
  margin-top: 0.5rem;
  cursor: pointer;
`;

interface NavigationBarProps {
  visible?: boolean;
  buffer?: boolean;
}

export const NavigationBar = (props: NavigationBarProps) => {
  const visible = props.visible ?? true;
  const buffer = props.buffer ?? true;

  return (
    <>
      <StyledNavbar
        className={`${visible ? "styled-nav-visible" : "styled-nav-hidden"}`}
        fixed="top"
        bg="light"
        expand="md">
        <Container fluid>
          <Col xs={2}>
            <Nav className="me-auto">
              <LinkContainer to="/" onClick={() => window.scrollTo(0, 0)}>
                <Navbar.Brand>
                  <img
                    src="/logo.png"
                    width="40px"
                    height="40px"
                    className="d-inline-block align-top"
                    alt=""
                  />
                </Navbar.Brand>
              </LinkContainer>
            </Nav>
          </Col>
          <LinkContainer to="/" onClick={() => window.scrollTo(0, 0)}>
            <StyledBullhornText>The Bullhorn</StyledBullhornText>
          </LinkContainer>
          <Col xs={2}>
            <Navbar.Toggle aria-controls="responsive-navbar" />
          </Col>
        </Container>

        <Container fluid className="flex-nowrap" style={{ flexWrap: "nowrap" }}>
          <Col xs={0} md={2} />
          <Navbar.Collapse id="responsive-navbar" className="flex-grow-0">
            <Nav
              as="ul"
              className="flex-grow-1 justify-content-center flex-shrink-0">
              {sections.map(section => (
                <Nav.Item as="li" key={section}>
                  <LinkContainer to={`/section/${section.toString()}`}>
                    <Nav.Link eventKey={`/section/${section.toString()}`}>
                      {section.toString()}
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
            </Nav>
          </Navbar.Collapse>
          <Col xs={2} />
        </Container>
      </StyledNavbar>

      {buffer && <div style={{ height: "90px" }} />}
    </>
  );
};
