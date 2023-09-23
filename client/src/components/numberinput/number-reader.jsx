/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export default function NumberReader({ number }) {
    return <div css={readerStyle}>
        {number}
    </div>;
}

const readerStyle = css`
    border: 1px black solid;
    height: 40px;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
