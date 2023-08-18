import { useEffect, useRef } from 'react';
import './number-input.css';

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
			className={"binary-input" + (dispatchIsOn ? " binary-input-changeable" : "")} 
			onClick={() => dispatchIsOn && dispatchIsOn()}
			ref={root}
		>
			<div className="binary-input-display">{isEmpty ? '' : isOn ? 1 : 0}</div>
		</div>
	)
}