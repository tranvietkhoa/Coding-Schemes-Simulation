import { createContext, useCallback, useContext, useReducer } from "react";


const useHammingContextStates = () => {
    const [rawMessage, dispatchRawMessage] = useReducer((state, action) => {
        switch (action.type) {
            case 'increase':
                return [...state, false];
            case 'flip':
                return state.map((bit, i) => (i === action.payload.index ? !bit : bit));
            case 'decrease':
                return state.slice(0, state.length - 1);
            case 'revert':
                return action.payload.currentSaved;
            case 'set':
                return action.payload.raw;
        }
    }, [false]);
    const [savedRawMessage, dispatchSavedRawMessage] = useReducer((state, action) => {
        switch (action.type) {
            case 'set':
                return action.payload.currentRaw;
        }
    })
    const [encodedMessage, dispatchEncodedMessage] = useReducer((state, action) => {
        switch (action.type) {
            case 'set':
                return action.payload.encoded;
            case 'revert':
                return action.payload.currentSaved;
            case 'increase':
                return [...state, {
                    value: false,
                    show: true,
                }];
            case 'decrease':
                return state.slice(0, state.length - 1);
            case 'reset':
                return state.map(() => ({
                    value: false,
                    show: false,
                }));
            case 'flip':
                return state.map((bit, i) => ({
                    value: i === action.payload.index ? !bit.value : bit.value,
                    show: bit.show,
                }));
        }
    }, [{
        value: false,
        show: false,
    }]);
    const [savedEncodedMessage, dispatchSavedEncodedMessage] = useReducer((state, action) => {
        switch (action.type) {
            case 'set':
                return action.payload.encoded;
        }
    }, [{
        value: false,
        show: false,
    }]);

    const increaseRawMessageLength = useCallback(() => {
        dispatchRawMessage({
            type: 'increase',
        });
    }, []);
    const decreaseRawMessageLength = useCallback(() => {
        dispatchRawMessage({
            type: 'decrease',
        });
    }, []);
    const flipRawMessageBit = useCallback((bitIndex) => {
        dispatchRawMessage({
            type: 'flip',
            payload: {
                index: bitIndex,
            },
        });
    }, []);
    const encodeRawMessage = useCallback((newRaw, newEncodedMessage) => {
        const encodeFormatted = newEncodedMessage.map(bit => ({
            value: bit,
            show: true,
        }));
        dispatchRawMessage({
            type: 'set',
            payload: {
                raw: newRaw,
            }
        })
        dispatchSavedRawMessage({
            type: 'set',
            payload: {
                currentRaw: newRaw,
            },
        });
        dispatchEncodedMessage({
            type: 'set',
            payload: {
                encoded: encodeFormatted,
            },
        });
        dispatchSavedEncodedMessage({
            type: 'set',
            payload: {
                encoded: encodeFormatted,
            },
        });
    }, []);
    const resetRawMessage = useCallback(() => {
        dispatchRawMessage({
            type: 'revert',
            payload: {
                currentSaved: savedRawMessage,
            },
        });
    }, [savedRawMessage]);
    const resetEncodeSimulation = useCallback(() => {
        dispatchEncodedMessage({
            type: 'reset',
        });
    }, []);
    
    const increaseEncodedMessageLength = useCallback(() => {
        dispatchEncodedMessage({
            type: 'increase',
        });
    }, []);
    const decreaseEncodedMessageLength = useCallback(() => {
        dispatchEncodedMessage({
            type: 'decrease',
        });
    }, []);
    const flipEncodedMessageBit = useCallback((bitIndex) => {
        dispatchEncodedMessage({
            type: 'flip',
            payload: {
                index: bitIndex,
            }
        })
    }, []);
    const resetEncodedMessage = useCallback(() => {
        dispatchEncodedMessage({
            type: 'revert',
            payload: {
                currentSaved: savedEncodedMessage,
            },
        });
    }, [savedEncodedMessage]);
    const decodeMessage = useCallback((correctedEncodedMessage, newRawMessage) => {
        dispatchRawMessage({
            type: 'set',
            payload: {
                raw: newRawMessage,
            },
        });
        dispatchSavedRawMessage({
            type: 'set',
            payload: {
                currentRaw: newRawMessage,
            },
        });
        dispatchSavedEncodedMessage({
            type: 'set',
            payload: {
                encoded: correctedEncodedMessage.map(bit => ({
                    value: bit,
                    show: true,
                })),
            },
        });
    }, []);

    return {
        rawMessage,
        encodedMessage,
        savedEncodedMessage,
        increaseRawMessageLength,
        decreaseRawMessageLength,
        flipRawMessageBit,
        encodeRawMessage,
        resetRawMessage,
        resetEncodeSimulation,
        increaseEncodedMessageLength,
        decreaseEncodedMessageLength,
        flipEncodedMessageBit,
        resetEncodedMessage,
        decodeMessage,
    };
};

const HammingContext = createContext(null);

export const HammingContextProvider = ({ children }) => (
    <HammingContext.Provider value={useHammingContextStates()}>
        {children}
    </HammingContext.Provider>
);

export const useHammingContext = () => useContext(HammingContext);