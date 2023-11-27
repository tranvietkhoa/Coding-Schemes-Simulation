/** @jsxImportSource @emotion/react */
import ArrowUp from './arrow-up';
import ArrowDown from './arrow-down';
import { css } from '@emotion/react';

export default function NumberInput({ number, setNumber, ignoreZero }) {
	const changeNumber = (e) => {
		if (!isNaN(e.target.value) && (
			Number(e.target.value) > 0 || (ignoreZero && Number(e.target.value) === 0)
		)) {
			setNumber(Number(e.target.value));
		}
	}

  return (
		<div css={numberInputStyle}>
			<input 
				type="text" 
				css={numberInputField} 
				value={number} 
				onChange={changeNumber}
				onFocus={e => e.target.select()}
			/>
			<div css={numberInputControlStyle}>
				<div 
					css={arrowContainerStyle} 
					onClick={() => setNumber(number + 1)}
				>
					<ArrowUp />
				</div>
				<div 
					css={arrowContainerStyle} 
					onClick={() => (number > 1 || (ignoreZero && number === 1)) && setNumber(number - 1)}
				>
					<ArrowDown />
				</div>
			</div>
		</div>
	)
}

const numberInputStyle = css`
	display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
`;

const numberInputField = css`
	width: 55px;
	font-size: 20px;
	border-radius: 10px;
	padding: 8px;
`;

const numberInputControlStyle = css`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 40px;
`;

const arrowContainerStyle = css`
	height: 16px;
	width: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px transparent solid;
	
	:hover {
		border: 1px #f0f0f0 solid;
	}
`;

export const arrowFillStyle = css`
	fill: black;
`;
