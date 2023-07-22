import { useState, useReducer, useMemo } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import './convolutional-demo.css';

export default function ConvolutionalEncodeDemo() {
  const [k, setK] = useState(1);
	const [l, setL] = useState(1);
	const [n, setN] = useState(1);
	const [initialInputStream, dispatchInitialInputStream] = useReducer((state, action) => {
		if (action.payload > state.length) {
			return [...state, ...Array(action.payload - state.length).fill(false)]
		} else {
			return state.filter((_, i) => i < action.payload);
		}
	}, [false]);
	const [inputStream, dispatchInputStream] = useReducer((state, action) => {
		switch (action.type) {
			case 'reset':
				return initialInputStream;
			case 'flip':
				return state.map((elem, i) => i === action.index ? !elem : elem);
			case 'resize':
				if (action.index > state.length) {
					return [...state, ...Array(action.index - state.length).fill(false)];
				} else {
					return state.filter((_, i) => i < action.index);
				}
		}
	}, [false]);

	const resetK = (newK) => {
		setK(newK);
		dispatchInitialInputStream({
			payload: newK
		});
		setTimeout(() => dispatchInputStream({
			type: 'resize',
			index: newK
		}));
	}

	return (
		<div id="encode-demo">
			<NumberInput number={k} setNumber={resetK} />
			<div id="input-stream">
				{
					inputStream.map((bit, i) => (
						<BinaryInput 
							isOn={bit} 
							dispatchIsOn={() => dispatchInputStream({
								type: 'flip',
								index: i
							})} 
							key={i}
						/>
					))
				}
			</div>
		</div>
	)
}