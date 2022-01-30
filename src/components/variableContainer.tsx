import { Container } from "react-bootstrap";
import styled, { css } from "styled-components";

export const VariableContainer = styled(Container)`
  ${props =>
    props.xs &&
    css`
      @media (min-width: 0px) {
        max-width: ${props.xs}px;
      }
    `}

  ${props =>
    props.sm &&
    css`
      @media (min-width: 576px) {
        max-width: ${props.sm}px;
      }
    `}

  ${props =>
    props.md &&
    css`
      @media (min-width: 768px) {
        max-width: ${props.md}px;
      }
    `}

    ${props =>
    props.lg &&
    css`
      @media (min-width: 992px) {
        max-width: ${props.lg}px;
      }
    `}

    ${props =>
    props.xl &&
    css`
      @media (min-width: 1200px) {
        max-width: ${props.xl}px;
      }
    `}

    ${props =>
    props.xxl &&
    css`
      @media (min-width: 1400px) {
        max-width: ${props.xxl}px;
      }
    `}
`;
