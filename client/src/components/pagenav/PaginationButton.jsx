/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMainPageContext } from "../../pages/context";
import { useMemo } from "react";
import { Link, useLocation } from 'react-router-dom';


export default function PaginationButton({ pageName, order }) {
  const { moveToPage } = useMainPageContext();
  const link = useMemo(() => pageName.toLowerCase().split(' ').reduce((u, v) => u + "-" + v), [pageName]);
  const location = useLocation();

  return (
    <Link 
      to={"/pages/" + link} 
      css={buttonCss(location.pathname.startsWith('/pages/' + link))} 
      onClick={() => moveToPage(order)}
    >
      {pageName}
    </Link>
  );
}

const buttonCss = (isHighlighting) => css`
  width: 254px;
  padding: 12px 0px;
  border: 1px solid black;
  text-align: center;
  cursor: pointer;
  color: black;
  ${isHighlighting ? "background-color: #41BA36;" : ""}
`;
