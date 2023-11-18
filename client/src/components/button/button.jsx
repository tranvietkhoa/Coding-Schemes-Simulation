/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export default function Button({ onClick, variant, text }) {
    return <div css={buttonCss(variant)} onClick={onClick}>{text}</div>
};

const buttonCss = (variant) => css`
    padding: 14px;
    border-radius: 10px;
    background-color: ${
        variant === 'red' 
        ? "#f04d4d"
        : variant === 'green'
        ? "#4dfa87"
        : variant === 'blue'
        ? "#4dbefa"
        : "white"
    };
    border-width: 0px;
    cursor: pointer;
    font-size: 18px;
    width: fit-content;

    :hover {
        background-color: ${
            variant === 'red'
            ? "#cc4533"
            : variant === 'green'
            ? "#33cc66"
            : variant === 'blue'
            ? "#3dabcc"
            : "#f0f0f0"
        }
    }
`;
