import { Link } from "react-router-dom";
import styled from "styled-components";

export const ThemedLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin-left: 0;
  margin-right: 0;

  :hover {
    color: rgb(${({ theme }) => theme.lemanColorComponents});
    text-decoration: underline;
  }
`;
