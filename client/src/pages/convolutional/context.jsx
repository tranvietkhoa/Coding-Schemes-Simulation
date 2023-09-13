import { createContext, useCallback, useContext, useReducer, useState } from 'react';

const useConvolutionalState = () => {
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
            default:
                console.error("unrecognised action type", action.type);
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
            case 'setnew':
                return action.payload;
            default:
                console.error("unrecognised action type", action.type);
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
            default:
                console.error("unrecognised action type", action.type);
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
                }));
            default:
                console.error("unrecognised action type", action.type);
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
        case 'flip':
            return state.map((bit, i) => i === action.payload.index ? !bit : bit);
        default:
            console.error("unrecognised action type", action.type);
        }
    }, [false]);

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

	const flipAdderBit = useCallback((row, col) => {
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
	}, []);

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

    const simulateEncode = useCallback(() => {
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

    const flipEncodedBit = useCallback((bitIndex) => {
        dispatchMessage({
            type: 'flip',
            payload: {
                index: bitIndex,
            },
        });
    }, []);

    const setOriginalMessage = useCallback((originalMessage) => {
        dispatchInitialInputStream({
            type: 'setnew',
            payload: originalMessage,
        });
        dispatchInputStream({
            type: 'setnew',
            payload: originalMessage,
        });
    }, []);

    const setStepCountToZero = useCallback(() => {
        setStepCount(0);
    }, []);

    return {
        k,
        l,
        n,
        resetK,
        resetL,
        resetN,
        inputStream,
        currState,
        adders,
        stepCount,
        message,
        flipAdderBit,
        flipInputStreamBit,
        simulateNextStep,
        resetSimulation,
        simulateEncode,
        flipEncodedBit,
        setOriginalMessage,
        setStepCountToZero,
    };
};

const ConvolutionalContext = createContext(null);

export const ConvolutionalContextProvider = ({ children }) => (
    <ConvolutionalContext.Provider value={useConvolutionalState()}>{children}</ConvolutionalContext.Provider>
);

export const useConvolutionalContext = () => useContext(ConvolutionalContext);