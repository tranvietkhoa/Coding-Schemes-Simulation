import { useState, useReducer, useCallback, useRef, useEffect, Fragment } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import { CustomArrow } from '../customarrow/arrow';
import { useEncodeContext } from '../../pages/demo';
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
				return action.initialInputStream.map((elem, i) => i === action.index ? !elem : elem);
			case 'resize':
				if (action.index > state.length) {
					return [...state, ...Array(action.index - state.length).fill(false)];
				} else {
					return state.slice(0, action.index);
				}
      case 'next':
        return state.slice(0, state.length - 1);
      case 'exhaust':
        return Array(0);
		}
	}, [false]);
	const [currState, dispatchCurrState] = useReducer((state, action) => {
		switch (action.type) {
			case 'reset':
				return Array(action.payload ? action.payload : state.length).fill(false);
			case 'next':
				return [action.bit, ...state.slice(0, state.length - 1)];
      case 'final':
        if (action.payload.currK >= action.payload.currL - 1) {
          return [0, ...action.payload.initialInputStream.slice(0, action.payload.currL)];
        } else {
          return [0, ...action.payload.initialInputStream, ...Array(action.payload.currL - action.payload.currK - 1).fill(false)];
        }
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
  const [message, dispatchMessage] = useReducer((state, action) => {
    switch (action.type) {
      case 'resize':
        return Array(action.payload).fill(false);
      case 'reset':
        return Array(state.length).fill(false);
      case 'next':
        return state.map((bit, i) => {
          if (i >= action.payload.currN * (action.payload.currStep - 1) && i < action.payload.currN * action.payload.currStep) {
            return action.payload.text[i - action.payload.currN * (action.payload.currStep - 1)] === '1';
          } else {
            return bit;
          }
        });
      case 'set':
        return action.payload;
    }
  }, [false]);
  const boxWidth = 40;
  const inputArray = useRef(null);
  const [inputArrayRight, setInputArrayRight] = useState(0);
  const [inputArrayBottom, setInputArrayBottom] = useState(0);
  const { isContentLoading } = useEncodeContext();

  useEffect(() => {
    if (!isContentLoading) {
      setTimeout(() => {
        const inputArrayRect = inputArray.current.getBoundingClientRect();
        setInputArrayRight(inputArrayRect.right);
        setInputArrayBottom(inputArrayRect.bottom);
      }, 100);
    }
  }, [isContentLoading]);

	const resetK = useCallback((newK) => {
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
    dispatchMessage({
      type: 'resize',
      payload: n * newK
    });
	}, [n]);

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
    dispatchMessage({
      type: 'reset',
    });
	}

	const resetN = useCallback((newN) => {
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
    dispatchMessage({
      type: 'resize',
      payload: k * newN
    });
	}, [l, k]);

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
    dispatchMessage({
      type: 'reset'
    });
	}

  const flipInputStreamBit = useCallback((i) => {
    dispatchInputStream({
      type: 'flip',
      index: i,
      initialInputStream: initialInputStream
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
    dispatchMessage({
      type: 'reset'
    });
  }, [initialInputStream]);

  const simulateNextStep = useCallback(() => {
    if (stepCount <= k) {
      fetch(`/convolutional/transmit?n=${n}&L=${l}&${adders.map(adder => 'adders[]=' + adder.adder.reduce((prev, bit) => prev + (bit ? '1' : '0'), '')).reduce((prev, curr) => prev + '&' + curr)}&currState=${currState.map(bit => bit ? '1' : '0').reduce((prev, curr) => prev + curr, '')}`)
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
          dispatchMessage({
            type: 'next',
            payload: {
              currN: n,
              currStep: stepCount,
              text: text
            }
          });
        });
    }
  }, [stepCount, inputStream, adders, currState, n, l, k]);

  const resetSimulation = useCallback(() => {
    dispatchInputStream({
      type: 'reset'
    });
    dispatchCurrState({
      type: 'reset'
    });
    dispatchAdders({
      type: 'hideResults'
    });
    dispatchMessage({
      type: 'reset'
    });
    setStepCount(0);
  }, []);

  const simulate = useCallback(() => {
    fetch(`/convolutional/encode?k=${k}&n=${n}&L=${l}&input=${initialInputStream.map(bit => bit ? '1' : '0').reduce((prev, curr) => prev + curr, '')}&${adders.map(adder => 'adders[]=' + adder.adder.reduce((prev, bit) => prev + (bit ? '1' : '0'), '')).reduce((prev, curr) => prev + '&' + curr)}`)
      .then(response => response.text())
      .then(text => {
        dispatchMessage({
          type: 'set',
          payload: text.split('').filter(bit => bit === '1' || bit === '0').map(bit => bit === '1'),
        });
        dispatchInputStream({
          type: 'exhaust'
        });
        dispatchAdders({
          type: 'hideResults'
        });
        dispatchCurrState({
          type: 'final',
          payload: {
            currK: k,
            currL: l,
            initialInputStream: initialInputStream
          },
        });
        setStepCount(k + 1);
      });
  }, [k, n, l, initialInputStream, adders]);

	return (
		<div id="encode-demo">
      <div className="encode-box">
        <div className="k-L-box-container">
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
          <div className="binary-input-array" ref={inputArray}>
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
        <div className="" id="n-box">
          <div className="number-input-indicator" id="n-indicator">
            <div>n =</div>
            <NumberInput number={n} setNumber={resetN} />
          </div>
        </div>
        <div id="adders" className="">
          {
            adders.map((adder, i) => (
              <Adder 
                adder={adder} 
                flipAdderBit={flipAdderBit} 
                i={i}
                inputRight={inputArrayRight}
                inputBottom={inputArrayBottom}
                boxWidth={boxWidth}
                l={l}
                key={i} 
              />
            ))
          }
        </div>
      </div>
      <div className="encode-box">
        <div id="encode-message">
          <div>Message:</div>
          <div className="binary-input-array">
            {message.map((bit, i) => (
              <BinaryInput 
                isOn={bit}
                highlightAnimation={(stepCount - 2) * n <= i && i < (stepCount - 1) * n}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
      <div id="buttons">
        <button className="btn btn-danger" onClick={resetSimulation}>reset simulation</button>
        <button className="btn btn-primary" onClick={simulateNextStep}>next step</button>
        <button className="btn btn-success" onClick={simulate}>result</button>
      </div>
		</div>
	)
}

const Adder = ({ adder, flipAdderBit, i, inputRight, inputBottom, boxWidth, l }) => {
  const inputArray = useRef(null);
  const resultBox = useRef(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [arrEndX, setArrEndX] = useState(0);
  const [arrEndY, setArrEndY] = useState(0);
  const { isContentLoading } = useEncodeContext();

  useEffect(() => {
    if (!isContentLoading) {
      setTimeout(() => {
        const inputArrayRect = inputArray.current.getBoundingClientRect();
        const resultBoxRect = resultBox.current.getBoundingClientRect();
        setStartX(inputArrayRect.right);
        setEndX(resultBoxRect.left);
        setStartY((inputArrayRect.top + inputArrayRect.bottom) / 2);
        setEndY((resultBoxRect.top + resultBoxRect.bottom) / 2);
        setArrEndX(inputArrayRect.right - boxWidth * l / 2);
        setArrEndY(inputArrayRect.top);
      }, 100);
    }
  }, [boxWidth, l, isContentLoading]);
  
  return <div className="adder">
    <div className="binary-input-array" ref={inputArray}>
      {
        adder.adder.map((bit, j) => (<Fragment key={j}>
          <BinaryInput 
            isOn={bit}
            dispatchIsOn={() => flipAdderBit(i, j)}
          />
          {bit && <CustomArrow
            start={{
              x: inputRight - boxWidth * (l - j - 0.5),
              y: inputBottom
            }}
            end={{
              x: arrEndX,
              y: arrEndY,
            }}
          />}
        </Fragment>))
      }
    </div>
    <div className="adder-result" ref={resultBox}>
      <BinaryInput 
        isOn={adder.result.bit}
        isEmpty={!adder.result.show}
      />
    </div>
    <CustomArrow
      start={{
        x: startX,
        y: startY,
      }}
      end={{
        x: endX,
        y: endY,
      }}
    />
  </div>;
}