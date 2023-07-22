import './number-input.css';

export default function BinaryInput({ isOn, dispatchIsOn }) {
	return (
		<div className="binary-input" onClick={() => dispatchIsOn && dispatchIsOn()}>
			<div className="binary-input-display">{isOn ? 1 : 0}</div>
		</div>
	)
}