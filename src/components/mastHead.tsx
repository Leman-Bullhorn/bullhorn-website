import { useEffect } from "react";
import { Container, Row, Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";
import { LinkContainer } from "./linkContainer";
import { sections } from "../types";
import { HorizontalDivider } from "./horizontalDivider";
import { useInView } from "react-intersection-observer";

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
      <HorizontalDivider />
      <BorderedRow>
        <Nav fill as="ul">
          {sections.map(section => (
            <Nav.Item as="li" key={section}>
              <LinkContainer to={`/section/${section.toString()}`}>
                <StyledLink eventKey={`/section/${section.toString()}`}>
                  {section.toString()}
                </StyledLink>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </BorderedRow>
    </Container>
  );
};

const StyledNavbar = styled(Navbar)`
  .navbar-brand {
    padding: 0;
    margin: 0;
    font-family: Amador;
    font-size: 100px;
    line-height: 100px;
    -webkit-text-stroke: 2.5px rgb(168, 195, 217);
  }

  .navbar-text {
    color: rgb(${({ theme }) => theme.lemanColorComponents});
  }
`;

const BorderedRow = styled(Row)`
  margin-top: 0px;
  padding: 0 60px;
  border-bottom: 4px double black;
  margin-bottom: 1rem;
`;

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
  font-size: 1rem;
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
