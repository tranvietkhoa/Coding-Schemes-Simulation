import './number-input.css';

export default function BinaryInput({ isOn, dispatchIsOn, isEmpty }) {
	return (
		<div 
			className={"binary-input" + (dispatchIsOn ? " binary-input-changeable" : "")} 
			onClick={() => dispatchIsOn && dispatchIsOn()}
		>
			<div className="binary-input-display">{isEmpty ? '' : isOn ? 1 : 0}</div>
		</div>
	)
}