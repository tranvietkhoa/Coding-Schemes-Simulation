/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';

export default function BinaryInput({ isOn, dispatchIsOn, isEmpty, highlightAnimation }) {
	const root = useRef(null);

	useEffect(() => {
		if (highlightAnimation) {
			root.current.animate([
				{
					backgroundColor: 'transparent',
				},
				{
					backgroundColor: "#828282",
				},
				{
					backgroundColor: "transparent",
				},
			], {
				duration: 400,
			});
		}
	}, [highlightAnimation]);

	return (
		<div 
			css={binaryInputStyle(dispatchIsOn)}
			onClick={() => dispatchIsOn && dispatchIsOn()}
			ref={root}
		>
			<div css={binaryDisplayStyle}>{isEmpty ? '' : isOn ? 1 : 0}</div>
		</div>
	)
}

const binaryInputStyle = (isChangeable) => css`
	border: 1px solid black;
	height: 100%;
	width: 100%;
	user-select: none;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 40px;
    height: 40px;

	&:hover {
		${isChangeable ? "background-color: grey;" : ""}
	}
`;

const binaryDisplayStyle = css`
	width: fit-content;
    height: fit-content;
`;
