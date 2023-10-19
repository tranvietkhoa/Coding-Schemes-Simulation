/** @jsxImportSource @emotion/react */
import { useMainPageContext } from '../../pages/context';
import PrevButton from './prev-button';
import NextButton from './next-button';
import { css } from '@emotion/react';

export default function ChapterNav() {
  const { currChapter, currChapCount, nextChapter, prevChapter } = useMainPageContext();

	return currChapter !== -1 
	? <div css={navStyle}>
		<div css={chapterControlStyle} onClick={() => prevChapter()}>
			<PrevButton />
		</div>
		<div>{
			`${currChapter + 1} out of ${currChapCount}`
		}</div>
		<div css={chapterControlStyle} onClick={() => nextChapter()}>
			<NextButton />
		</div>
	</div>
	: '';
}

const navStyle = css`
	display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    width: 100%;
    user-select: none;
`;

const chapterControlStyle = css`
	border-radius: 50%;
	overflow: hidden;
	height: 30px;
	width: 30px;
	
	img {
		max-height: 100%;
		max-width: 100%;
	}
`;

export const svgStyle = css`
	background-color: beige;
`;

export const polygonStyle = css`
	fill: black;
`;
