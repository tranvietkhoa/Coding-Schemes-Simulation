/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';
import { css } from '@emotion/react';

export const CustomArrow = ({ start, end }) => {
    const length = useMemo(() => {
        return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
    }, [start.x, start.y, end.x, end.y]);
    const rotationAngle = useMemo(() => {
        if (end.x - start.x === 0) {
            return end.y - start.y > 0 ? 90 : -90;
        }
        const tanAngle = Math.atan((end.y - start.y) / (end.x - start.x)) * 180 / Math.PI;
        const offsetAngle = 
            end.x - start.x < 0
            ? tanAngle > 0
                ? -180
                : 180
            : 0;
        return tanAngle + offsetAngle;
    }, [start.x, start.y, end.x, end.y]);

    return <svg 
        height="8" 
        width={length + 2}
        css={customArrowStyle(start.x, start.y, rotationAngle)}
    >
        <line css={lineStyle} x1={1} y1={4} x2={length + 1} y2={4} />
        <line css={lineStyle} x1={length - 2} y1={1} x2={length + 1} y2={4} />
        <line css={lineStyle} x1={length - 2} y1={7} x2={length + 1} y2={4} />
    </svg>;
}

const customArrowStyle = (x, y, rotationAngle) => css`
    position: fixed;
    top: ${y - 4}px;
    left: ${x - 1}px;
    transform-origin: 1px 4px;
    transform: rotate(${rotationAngle}deg);
`;

const lineStyle = css`
    stroke: black;
    stroke-width: 1px;
    stroke-linecap: round;
`;
