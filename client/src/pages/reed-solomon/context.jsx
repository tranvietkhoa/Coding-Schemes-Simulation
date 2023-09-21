import { useReducer, useCallback, createContext, useContext } from 'react';

const useReedSolomonState = () => {
    const maxVal = 929;
    const [rawMessage, dispatchRawMessage] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'setBit':
                    return state.map((bit, bitIndex) => (
                        bitIndex === action.payload.index
                        ? action.payload.value
                        : bit
                    ));
                case 'set':
                    return action.payload;
                default:
                    console.error("unrecognised action type", action.type);
            }
        }, 
        [0, 0, 0],
    );
    const [savedRawMessage, dispatchSavedRawMessage] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'set':
                    return action.payload;
                default:
                    console.error("unrecognised action type", action.type);
            }
        },
        [0, 0, 0],
    );
    const [encodedMessage, dispatchEncodedMessage] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'set':
                    return action.payload;
                case 'setBit':
                    return state.map((bit, bitIndex) => (
                        bitIndex === action.payload.index
                        ? action.payload.value 
                        : bit
                    ));
                default:
                    console.error("unrecognised action type", action.type);
            }
        },
        [0, 0, 0, 0, 0, 0, 0],
    );
    const [savedEncodedMessage, dispatchSavedEncodedMessage] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'set':
                    return action.payload;
                default:
                    console.error("unrecognised action type", action.type);
            }
        },
        [0, 0, 0, 0, 0, 0, 0],
    );

    const setRawBit = useCallback((index, value) => {
        if (value >= 0 && value < maxVal) {
            dispatchRawMessage({
                type: 'setBit',
                payload: {
                    index: index,
                    value: value,
                },
            });
        }
    }, []);

    const setEncodedMessage = useCallback((result) => {
        dispatchEncodedMessage({
            type: 'set',
            payload: result,
        });
        dispatchSavedEncodedMessage({
            type: 'set',
            payload: result,
        });
    }, []);

    const resetRawMessage = useCallback(() => {
        dispatchRawMessage({
            type: 'set',
            payload: savedRawMessage,
        });
    }, [savedRawMessage]);

    return {
        rawMessage,
        encodedMessage,
        setRawBit,
        setEncodedMessage,
        resetRawMessage,
    };
};

const ReedSolomonContext = createContext(null);

export const ReedSolomonContextProvider = ({ children }) => (
    <ReedSolomonContext.Provider value={useReedSolomonState()}>
        {children}
    </ReedSolomonContext.Provider>
);

export const useReedSolomonContext = () => useContext(ReedSolomonContext);