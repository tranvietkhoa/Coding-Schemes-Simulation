import { useState, useReducer, useCallback } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import './convolutional-demo.css';

export default function ConvolutionalEncodeDemo() {
  const [k, setK] = useState(1);
	const [l, setL] = useState(1);
	const [n, setN] = useState(1);
	const [initialInputStream, dispatchInitialInputStream] = useReducer((state, action) => {
		switch (action.type) {
			case 'resize':
				if (action.payload > state.length) {
					return [...state, ...Array(action.payload - state.length).fill(false)]
				} else {
					return state.slice(0, action.payload);
				}
			case 'setnew':
				return action.payload;
      case 'flip':
        return state.map((elem, i) => i === action.payload ? !elem : elem);
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
					return state.slice(0, action.index);
				}
      case 'next':
        return state.slice(0, state.length - 1);
		}
	}, [false]);
	const [currState, dispatchCurrState] = useReducer((state, action) => {
		switch (action.type) {
			case 'reset':
				return Array(action.payload ? action.payload : state.length).fill(false);
			case 'next':
				return [action.bit, ...state.slice(0, state.length - 1)];
		}
	}, [false]);
	const [adders, dispatchAdders] = useReducer((state, action) => {
		switch (action.type) {
			case 'changeN':
				if (action.payload.newN > state.length) {
					return [...state, ...Array(action.payload.newN - state.length).fill({
						adder: Array(action.payload.currL).fill(false),
						result: {
							bit: false,
							show: false,
						}
					})];
				} else {
					return state.slice(0, action.payload.newN);
				}
			case 'changeL':
				if (action.payload.newL > state[0].adder.length) {
					return state.map(adder => ({
						adder: [...adder.adder, ...Array(action.payload.newL - state[0].adder.length).fill(false)],
						result: {
							bit: false,
							show: false
						}
					}));
				} else {
					return state.map(adder => ({
            adder: adder.adder.slice(0, action.payload.newL),
            result: {
              bit: false,
              show: false,
            }
          }));
				}
			case 'flip':
				return state.map((adder, i) => ({
					adder: adder.adder.map((bit, j) => (i === action.payload.i && j === action.payload.j) ? !bit : bit),
					result: {
						bit: false,
						show: false,
					},
				}));
      case 'hideResults':
        return state.map(adder => ({
          adder: adder.adder,
          result: {
            bit: false,
            show: false,
          }
        }));
      case 'next':
        return state.map((adder, i) => ({
          adder: adder.adder,
          result: {
            bit: action.payload[i],
            show: true,
          }
        }))
		}
	}, [{
		adder: [false],
		result: {
			bit: false,
			show: false,
		}
	}]);
  const [stepCount, setStepCount] = useState(0);

	const resetK = (newK) => {
		setK(newK);
		dispatchInitialInputStream({
			type: 'resize',
			payload: newK
		});
		dispatchInputStream({
			type: 'resize',
			index: newK
		});
		dispatchCurrState({
			type: 'reset',
		});
    dispatchAdders({
      type: 'hideResults',
    });
    setStepCount(0);
	}

	const resetL = (newL) => {
		setL(newL);
		dispatchCurrState({
			type: 'reset',
			payload: newL,
		});
		dispatchInputStream({
			type: 'reset',
		});
    dispatchAdders({
      type: 'changeL',
      payload: {
        newL: newL,
      }
    });
    setStepCount(0);
	}

	const resetN = (newN) => {
    setN(newN);
    dispatchAdders({
      type: 'changeN',
      payload: {
        newN: newN,
        currL: l,
      }
    });
    dispatchCurrState({
      type: 'reset',
    });
    dispatchInputStream({
      type: 'reset',
    });
    setStepCount(0);
	}

	const flipAdderBit = (row, col) => {
		dispatchAdders({
			type: 'flip',
			payload: {
				i: row,
				j: col
			}
		});
    dispatchInputStream({
      type: 'reset',
    });
    dispatchCurrState({
      type: 'reset',
    });
    setStepCount(0);
	}

  const flipInputStreamBit = (i) => {
    dispatchInputStream({
      type: 'flip',
      index: i
    });
    dispatchInitialInputStream({
      type: 'flip',
      payload: i
    })
    dispatchCurrState({
      type: 'reset',
    });
    dispatchAdders({
      type: 'hideResults',
    });
    setStepCount(0);
  }

  const simulateNextStep = useCallback(() => {
    if (stepCount <= k) {
      fetch(`/convolutional/transmit?n=${n}&L=${l}&${adders.map(adder => 'adders=' + adder.adder.reduce((prev, bit) => prev + (bit ? '1' : '0'), '')).reduce((prev, curr) => prev + '&' + curr)}&currState=${currState.map(bit => bit ? '1' : '0').reduce((prev, curr) => prev + curr, '')}`)
        .then(response => response.text())
        .then(text => {
          setStepCount(stepCount + 1);
          dispatchInputStream({
            type: 'next',
          });
          dispatchCurrState({
            type: 'next',
            bit: inputStream[inputStream.length - 1],
          });
          if (stepCount > 0) {
            dispatchAdders({
              type: 'next',
              payload: text.split('').map(bit => bit === '1')
            });
          }
        });
    }
  }, [stepCount, inputStream, adders, currState, n, l, k]);

	return (
		<div id="encode-demo">
      <div className="encode-box">
        <div className="k-L-box-container box-left">
          <div className="number-input-indicator">
            <div>k =</div>
            <NumberInput number={k} setNumber={resetK} />
          </div>
          <div className="binary-input-array">
            {
              inputStream.map((bit, i) => (
                <BinaryInput 
                  isOn={bit} 
                  dispatchIsOn={() => flipInputStreamBit(i)} 
                  key={i}
                />
              ))
            }
          </div>
        </div>
        <div className="k-L-box-container box-right">
          <div className="number-input-indicator">
            <div>L =</div>
            <NumberInput number={l} setNumber={resetL} />
          </div>
          <div className="binary-input-array">
            {
              currState.map((bit, i) => (
                <BinaryInput 
                  isOn={bit}
                  key={i}
                />
              ))
            }
          </div>
        </div>
      </div>
      <div className="encode-box">
        <div className="box-left" id="n-box">
          <div className="number-input-indicator" id="n-indicator">
            <div>n =</div>
            <NumberInput number={n} setNumber={resetN} />
          </div>
        </div>
        <div id="adders" className="box-right">
          {
            adders.map((adder, i) => (
              <div className="adder" key={i}>
                <div className="binary-input-array">
                  {
                    adder.adder.map((bit, j) => (
                      <BinaryInput 
                        isOn={bit}
                        dispatchIsOn={() => flipAdderBit(i, j)}
                        key={j}
                      />
                    ))
                  }
                </div>
                <div className="adder-result">
                  <BinaryInput 
                    isOn={adder.result.bit}
                    isEmpty={!adder.result.show}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div id="buttons">
        <button className="btn btn-primary" onClick={simulateNextStep}>next step</button>
      </div>
		</div>
	)
}