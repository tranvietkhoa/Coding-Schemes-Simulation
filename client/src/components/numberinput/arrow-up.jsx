/** @jsxImportSource @emotion/react */
import { arrowFillStyle } from "./NumberInput";

export default function ArrowUp() {
  return (
		<svg height="5" width="10">
			<polygon points="0,5 5,0 10,5" css={arrowFillStyle}></polygon>
		</svg>
	)
}