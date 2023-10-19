/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export default function Header() {
    return (
        <div css={headerCss}>Error-correcting Code Simulator</div>
    );
};

const headerCss = css`
    background-color: #2D9724;
    text-transform: uppercase;
    text-align: center;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    font-size: 25px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 14px;
    color: white;
`;
