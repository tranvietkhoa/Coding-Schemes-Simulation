import ArrowUp from './arrow-up';
import ArrowDown from './arrow-down';
import './number-input.css';

export default function NumberInput({ number, setNumber }) {
	const changeNumber = (e) => {
		if (!isNaN(e.target.value) && Number(e.target.value) >= 0) {
			setNumber(Number(e.target.value));
		}
	}

  return (
		<div className="number-input">
			<input type="text" className="number-input-field form-control" value={number} onChange={changeNumber} />
			<div className="number-input-controls">
				<div className="arrow-container" onClick={() => setNumber(number + 1)}><ArrowUp /></div>
				<div className="arrow-container" onClick={() => setNumber(number - 1)}><ArrowDown /></div>
			</div>
		</div>
	)
}