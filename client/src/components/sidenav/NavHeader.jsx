/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Link, useLocation } from "react-router-dom";
import { useMainPageContext } from "../../pages/context";

export default function NavHeader() {
  const location = useLocation();
  const { moveToPage } = useMainPageContext();

  return (
    <div css={navCss}>
      <div css={topCss}>
        <Link to="/" css={[centerText, linkText(location.pathname === '/')]}>Home</Link>
        <Link to="/authors" css={[centerText, linkText(location.pathname.startsWith('/authors'))]}>Authors</Link>
        <Link to="/apidocs" css={[centerText, linkText(location.pathname === '/apidocs')]}>API Docs</Link>
      </div>
      <div css={bottomCss}>
        <Link 
          to="/pages/convolutional"
          css={linkText(location.pathname.startsWith('/pages/convolutional'))}
          onClick={() => moveToPage(0)}
        >
          <div css={bottomText}>Convolutional Simulator</div>
        </Link>
        <Link 
          to="/pages/hamming" 
          css={linkText(location.pathname.startsWith('/pages/hamming'))}
          onClick={() => moveToPage(1)}
        >
          <div css={bottomText}>Hamming Simulator</div>
        </Link>
        <Link 
          to="/pages/reed-solomon" 
          css={linkText(location.pathname.startsWith('/pages/reed-solomon'))}
          onClick={() => moveToPage(2)}
        >
          <div css={bottomText}>Reed-Solomon Simulator</div>
        </Link>
      </div>
    </div>
  )
};

const navCss = css`
  border: 2px solid black;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 34px 20px 23px 20px;

  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const topCss = css`
  padding-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  border-bottom: 1px solid black;
  align-items: center;
`;

const bottomCss = css`
  padding-top: 32px;
  padding-right: 1px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const centerText = css`
  text-align: center;
  color: black !important;
  text-decoration: none !important;
`;

const bottomText = css`
  width: 118px;
  color: black !important;
  text-decoration: none !important;
  align-self: flex-end;
`;

const linkText = (isHighlighting) => css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  ${isHighlighting ? "background-color: #D9D9D9;" : `&:hover {
    background-color: #f0f0f0
  }`}
`;
