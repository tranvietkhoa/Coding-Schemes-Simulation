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
				className="form-control" 
				value={number} 
				onChange={changeNumber}
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
`;

const numberInputControlStyle = css`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

const arrowContainerStyle = css`
	height: fit-content;
	width: fit-content;
`;

export const arrowFillStyle = css`
	fill: black;
`;
