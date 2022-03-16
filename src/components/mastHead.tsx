import { useState, useEffect, useRef, useMemo } from "react";
import { Container, Row, Nav, Navbar, Placeholder } from "react-bootstrap";
import styled from "styled-components";
import { LinkContainer } from "./linkContainer";
import { IApiError, ISection } from "../types";
import { HorizontalDivider } from "./horizontalDivider";
import { useQuery } from "react-query";
import { getSections } from "../api/requests";

interface MastHeadProps {
  changeVisibility?: (visible: boolean) => void;
}

export const Masthead = (props: MastHeadProps) => {
  const ref: any = useRef();
  const isVisible = useOnScreen(ref);

  useEffect(() => {
    props.changeVisibility?.(isVisible);
  }, [isVisible, props]);

  const {
    data: sections,
    isLoading,
    isError,
    error,
    isIdle,
  } = useQuery<ISection[], IApiError, ISection[]>("sections", getSections);

  if (isError) {
    return <h1>Error {error.message}</h1>;
  }

  return (
    <Container ref={ref}>
      <Row>
        <StyledNavbar
          className="justify-content-center"
          bg="white"
          expand={false}>
          <Nav className="flex-column">
            <Nav.Link href="/" onClick={() => window.scrollTo(0, 0)}>
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
          {isLoading || isIdle ? (
            <SectionsPlaceholder />
          ) : (
            sections.map(section => (
              <Nav.Item as="li" key={section.permalink}>
                <LinkContainer to={section.permalink}>
                  <StyledLink eventKey={section.permalink}>
                    {section.name}
                  </StyledLink>
                </LinkContainer>
              </Nav.Item>
            ))
          )}
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

function useOnScreen(ref: any) {
  const [isIntersecting, setIntersecting] = useState(true);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting),
      ),
    [],
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  });

  return isIntersecting;
}

const PlaceholderText = styled.span`
  padding: 0.5rem 1rem;
  display: block;
  line-height: 1rem;
`;

const SectionsPlaceholder = () => {
  return (
    <>
      {Array.from(Array(6).keys()).map(idx => (
        <Nav.Item as="li" key={idx}>
          <Placeholder as={PlaceholderText} animation="glow">
            <Placeholder xs={10} style={{ borderRadius: "0.125rem" }} />
          </Placeholder>
        </Nav.Item>
      ))}
    </>
  );
};
