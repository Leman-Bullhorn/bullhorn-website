import { useEffect } from "react";
import { Container, Row, Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";
import { LinkContainer } from "./linkContainer";
import { sections } from "../types";
import { useInView } from "react-intersection-observer";

const NavItem = styled(Nav.Item)`
  :last-child {
    border-right: none;
  }
  /* margin-top: 0.25rem;
  margin-bottom: 0.25rem; */
  border-right: 1px solid;
`;

interface MastHeadProps {
  changeVisibility?: (visible: boolean) => void;
}

export const Masthead = (props: MastHeadProps) => {
  const { ref, inView } = useInView();

  const changeVisibility = props.changeVisibility;

  useEffect(() => {
    changeVisibility?.(inView);
  }, [changeVisibility, inView]);

  return (
    <Container ref={ref}>
      <Row>
        <StyledNavbar
          className="justify-content-center"
          bg="white"
          expand={false}>
          <Nav className="flex-column">
            <Nav.Link href="/">
              <Navbar.Brand>The Bullhorn</Navbar.Brand>
            </Nav.Link>
          </Nav>
        </StyledNavbar>
      </Row>
      <Row className="text-center mb-1">
        <BrandText
          href="https://www.lemanmanhattan.org/"
          target="_blank"
          rel="noreferrer">
          Léman Manhattan Preparatory School
        </BrandText>
      </Row>
      <Row style={{ boxShadow: "0px 5px 5px -5px rgba(0, 0, 0, 0.28)" }}>
        <Nav fill as="ul" style={{ justifyContent: "center", gap: "1rem" }}>
          {sections.map(section => (
            <Nav.Item
              className="nav-item"
              as="li"
              style={{ flexGrow: 0 }}
              key={section.id}>
              <LinkContainer to={`/section/${section.toString()}`}>
                <StyledLink eventKey={`/section/${section.toString()}`}>
                  {section.display}
                </StyledLink>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </Row>
    </Container>
  );
};

const StyledNavbar = styled(Navbar)`
  .navbar-brand {
    padding: 0;
    margin: 0;
    font-family: Amador;
    font-size: 100px;
    line-height: 80px;
    -webkit-text-stroke: 2.5px rgb(168, 195, 217);
  }

  .navbar-text {
    color: rgb(${({ theme }) => theme.lemanColorComponents});
  }
`;

// const BorderedRow = styled(Row)`
//   padding: 0 60px;
//   padding-bottom: 0.25rem;
//   border-bottom: 2px solid black;
//   margin-bottom: 0.5rem;

//   :before {
//     content: "";
//     height: 1px;
//     width: 100%;
//     border-top: 1px solid black;
//     padding-top: 0.25rem;
//   }
// `;

const BrandText = styled.a`
  color: rgb(${({ theme }) => theme.lemanColorComponents});
  text-decoration-line: none;
  line-height: 1rem;
  font-weight: 500;
  transition: color 0.25s ease-in-out, background-color 0.25s ease-in-out,
    border-color 0.25s ease-in-out;

  :hover {
    text-decoration: underline;
  }
`;

const StyledLink = styled(Nav.Link)`
  color: black;
  text-decoration-color: black;
  text-decoration-line: none;
  font-size: 1.15rem;
  line-height: 1rem;
  font-weight: 500;
  transition: color 0.25s ease-in-out, background-color 0.25s ease-in-out,
    border-color 0.25s ease-in-out;

  :hover,
  :focus {
    color: black;
    background-color: rgba(${({ theme }) => theme.lemanColorComponents}, 0.5);
    text-decoration: underline;
  }
`;
