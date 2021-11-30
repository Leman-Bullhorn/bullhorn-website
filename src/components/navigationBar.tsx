import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import styled from "styled-components";
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

interface NavigationBarProps {
  visible?: boolean;
}

export default class NavigationBar extends React.Component<NavigationBarProps> {
  render() {
    const visible = this.props.visible ?? true;
    return (
      <StyledNavbar
        className={`${visible ? "styled-nav-visible" : "styled-nav-hidden"}`}
        fixed="top"
        bg="light">
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/logo.png"
              width="auto"
              height="40px"
              className="d-inline-block align-top"
              alt=""
            />
          </Navbar.Brand>
          <Nav fill as="ul">
            {sectionStore.getSections().map(section => (
              <Nav.Item as="li" key={section.route}>
                <Nav.Link
                  eventKey={section.route}
                  href={`sections/${section.route}`}>
                  {section.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Container>
      </StyledNavbar>
    );
  }
}
