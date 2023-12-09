/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { isPowerOf } from "../../utils/input-checker";
import { css } from "@emotion/react";

export const ParityPositions = ({ n }) => {
    const bits = useMemo(() => Array(Math.pow(2, n) - 1)
        .fill(false)
        .map((_, i) => ({
            position: Math.pow(2, n) - 1 - i,
            isParity: isPowerOf(Math.pow(2, n) - 1 - i, 2),
        })), [n]);
    
    return <div css={parityPositionCss}>
        {bits.map((bit, bitIndex) => (
            <div key={bitIndex} css={bitInfoCss}>
                <div css={bitCss(false)}>{bit.isParity ? "parity" : "data"}</div>
                <div css={bitPositionCss}>{bit.position}</div>
            </div>
        ))}
    </div>;
};

const parityPositionCss = css`
    display: flex;
    flex-direction: row;
`;

const bitInfoCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const bitCss = (showShort) => css`
    width: ${showShort ? 40 : 100}px;
    height: ${showShort ? 40 : 50}px;
    border: 1px black solid;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const bitPositionCss = css`
    padding: 20px;
`;

export const ParityBits = ({ n, showShort }) => {
    const parityInvolvementInfo = useMemo(() => Array.from(Array(Math.pow(2, n) - 1).keys())
        .map(i => Math.pow(2, n) - 1 - i)
        .map(i => {
            const isParity = isPowerOf(i, 2);
            const res = [];
            for (let j = 0; j < n; j++) {
                res.push(i % 2 === 1);
                i = Math.floor(i / 2);
            }
            return {
                isParity,
                involvements: res,
            };
        }), [n]);
    
    return <div css={parityPositionCss}>
        {parityInvolvementInfo.map((bitInvolvement, bitInvolvementIndex) => (
            <div key={bitInvolvementIndex}>
                <div css={bitCss(showShort)}>
                    {bitInvolvement.isParity 
                    ? showShort
                        ? "p"
                        : "parity"
                    : showShort
                        ? "d"
                        : "data"}
                </div>
                {bitInvolvement.involvements.map((involvement, involvementIndex) => (
                    <div key={involvementIndex} css={involvementCss(showShort)}>{involvement && "y"}</div>
                ))}
            </div>
        ))}
    </div>;
};

const involvementCss = (showShort) => css`
    width: ${showShort ? 40 : 100}px;
    height: ${showShort ? 40 : 50}px;
    border: 1px black solid;
    display: flex;
    justify-content: center;
    align-items: center;
`;
