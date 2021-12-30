import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import styled from "styled-components";
import LinkContainer from "./linkContainer";
import sectionStore from "../stores/sectionStore";

const StyledNavbar = styled(Navbar)`
  transition-property: all;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  transition-delay: 0s;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.28);
  padding-bottom: 0px;
  padding-top: 0px;

  &.styled-nav-visible {
    visibility: visible;
    transform: translateY(0px);
  }

  &.styled-nav-hidden {
    visibility: hidden;
    transform: translateY(-70px);
  }
`;

const NavbarCollapse = styled(Navbar.Collapse)`
  flex-grow: 0;
`;

interface NavigationBarProps {
  visible?: boolean;
  buffer?: boolean;
}

export default class NavigationBar extends React.Component<NavigationBarProps> {
  render() {
    const visible = this.props.visible ?? true;
    const buffer = this.props.buffer ?? true;
    return (
      <>
        <StyledNavbar
          className={`${visible ? "styled-nav-visible" : "styled-nav-hidden"}`}
          fixed="top"
          bg="light"
          expand="md">
          <Container>
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
            <Navbar.Toggle aria-controls="responsive-navbar" />
            <NavbarCollapse id="responsive-navbar">
              <Nav as="ul">
                {sectionStore.getSections().map(section => (
                  <Nav.Item as="li" key={section.route}>
                    <LinkContainer to={`sections/${section.route}`}>
                      <Nav.Link eventKey={section.route}>
                        {section.name}
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
              </Nav>
            </NavbarCollapse>
          </Container>
        </StyledNavbar>
        {buffer && <div style={{ height: "50px" }} />}
      </>
    );
  }
}
