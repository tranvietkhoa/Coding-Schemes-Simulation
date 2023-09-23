/** @jsxImportSource @emotion/react */
import { svgStyle, polygonStyle } from "./ChapterNav";

export default function PrevButton() {
  return <svg height="30" width="30" css={svgStyle}>
    <polygon points="10,15 20,6 20,24" css={polygonStyle} />
  </svg>;
}