/** @jsxImportSource @emotion/react */
import { svgStyle, polygonStyle } from "./ChapterNav";

export default function NextButton() {
	return <svg height="30" width="30" css={svgStyle}>
		<polygon points="20,15 10,6 10,24" css={polygonStyle} />
	</svg>;
}