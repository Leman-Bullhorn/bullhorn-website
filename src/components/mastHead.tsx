import { useState, useEffect, useRef } from "react";
import { Container, Row, Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";
import LinkContainer from "./linkContainer";
import sectionStore from "../stores/sectionStore";

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

const NavigationBar = () => {
  return (
    <StyledNavbar
      className="bullhorn-mast justify-content-center"
      bg="white"
      expand={false}>
      <Nav className="flex-column">
        <LinkContainer to="/" onClick={() => window.scrollTo(0, 0)}>
          <Navbar.Brand>The Bullhorn</Navbar.Brand>
        </LinkContainer>
      </Nav>
    </StyledNavbar>
  );
};

const BorderedRow = styled(Row)`
  margin-top: 0px;
  border-top: 1px solid rgba(${({ theme }) => theme.lemanColorComponents}, 0.4);
  padding: 0 60px;
  border-bottom: 4px double black;
  margin-bottom: 1rem;
`;

const Styles = styled.div`
  a {
    color: rgb(${({ theme }) => theme.lemanColorComponents});
    text-decoration-color: black;
    text-decoration-line: none;
    font-size: 1rem;
    line-height: 1rem;
    font-weight: 500;
    transition: color 0.25s ease-in-out, background-color 0.25s ease-in-out,
      border-color 0.25s ease-in-out;
  }

  a:hover {
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

function useOnScreen(ref: any) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting),
  );

  useEffect(() => {
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  });

  return isIntersecting;
}

interface MastHeadProps {
  changeVisibility?: (visible: boolean) => void;
}

const Masthead = (props: MastHeadProps) => {
  const ref: any = useRef();
  const isVisible = useOnScreen(ref);

  useEffect(() => {
    props.changeVisibility?.(isVisible);
  }, [isVisible, props]);

  return (
    <Container ref={ref}>
      <Row>
        <NavigationBar />
      </Row>
      <Styles className="text-center mb-0">
        <a
          href="https://www.lemanmanhattan.org/"
          target="_blank"
          rel="noreferrer">
          Léman Manhattan Preparatory School
        </a>
      </Styles>
      <BorderedRow>
        <Nav fill as="ul">
          {sectionStore.getSections().map(section => (
            <Nav.Item as="li" key={section.route}>
              <LinkContainer to={`sections/${section.route}`}>
                <StyledLink eventKey={section.route}>{section.name}</StyledLink>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </BorderedRow>
    </Container>
  );
};
export default Masthead;
