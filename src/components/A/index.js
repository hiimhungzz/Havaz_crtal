/* eslint-disable no-script-url */
/**
 * A link to a certain page, an anchor tag
 */

import styled from "styled-components";

const A = styled.a.attrs(props => ({
  className: "kt-link",
  href: props.href
}))`
  width: fit-content;
  color: rgb(100, 108, 154) !important;
  display: inherit !important;

  &:hover {
    color: #5d78ff !important;
  }
`;
export default A;
