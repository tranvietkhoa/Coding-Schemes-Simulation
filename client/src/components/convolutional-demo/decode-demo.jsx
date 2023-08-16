import './convolutional-decode.css';
import { useState, useCallback, useReducer } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import { isBinaryString } from '../../utils/input-checker';

export default function ConvolutionalDecodeDemo() {
  const [k, setK] = useState(1);
  const [n, setN] = useState(1);
  const [l, setL] = useState(1);
  const [adders, dispatchAdders] = useReducer((state, action) => {
    switch (action.type) {
      case 'changeN':
        if (action.payload.newN > state.length) {
          return [...state, ...Array(action.payload.newN - state.length).fill(
            Array(state[0].length).fill(false)
          )];
        } else {
          return state.slice(0, action.payload.newN);
        }
      case 'changeL':
        if (action.payload.newL > state[0].length) {
          return state.map(adder => [...adder, ...Array(action.payload.newL - state[0].length).fill(false)]);
        } else {
          return state.slice(0, action.payload.newL);
        }
      case 'flip':
        return state.map((adder, i) => {
          return i === action.payload.i
            ? adder.map((bit, j) => j === action.payload.j ? !bit : bit)
            : adder;
        });
    }
  }, [[false]]);
  const [message, setMessage] = useState('');
  const [correctedMessage, setCorrectedMessage] = useState('');
  const [originalMessage, setOriginalMessage] = useState('');
  const [isMessageValid, setIsMessageValid] = useState(true);
  const [invalidMessage, setInvalidMessage] = useState('');

  const resetK = useCallback((newK) => {
    setK(newK);
  }, []);

  const resetN = useCallback((newN) => {
    setN(newN);
    dispatchAdders({
      type: "changeN",
      payload: {
        newN: newN,
      }
    });
  }, []);

  const resetL = useCallback((newL) => {
    setL(newL);
    dispatchAdders({
      type: "changeL",
      payload: {
        newL: newL,
      }
    })
  }, []);

  const flipAdderBit = useCallback((i, j) => {
    dispatchAdders({
      type: "flip",
      payload: {
        i: i,
        j: j,
      }
    })
  }, []);

  const validateMessage = useCallback((message) => {
    if (!isBinaryString(message)) {
      setInvalidMessage("Message must be a binary string!");
      setIsMessageValid(false);
      return false;
    } else if (message.length !== k * n) {
      setInvalidMessage(`Message must be of length k x n = ${k * n} bits!`);
      setIsMessageValid(false);
      return false;
    } else {
      setIsMessageValid(true);
      return true;
    }
  }, [k, n]);

  const updateEncodedMessage = useCallback((event) => {
    if (isBinaryString(event.target.value)) {
      setMessage(event.target.value);
    }
    validateMessage(event.target.value);
  }, [validateMessage]);

  const decode = useCallback(() => {
    if (!validateMessage(message)) return;
    fetch(`/convolutional/decode?k=${k}&n=${n}&L=${l}&${adders.map(adder => 'adders[]=' + adder.reduce((prev, bit) => prev + (bit ? '1' : '0'), '')).reduce((prev, curr) => (prev + '&' + curr))}&message=${message.split('').reduce((prev, bit, i) => prev + bit + (i % n === n - 1 ? ' ' : ''))}`)
      .then(response => response.text())
      .then(text => {
        const fragments = text.split(' ');
        setOriginalMessage(fragments[fragments.length - 1]);
        setCorrectedMessage(fragments.slice(0, fragments.length - 1).reduce((prev, curr) => prev + curr));
      })
  }, [k, n, l, adders, message, validateMessage]);

  return <div className="convolutional-decode">
    <div className="top">
      <div className="top-left">
        <div className="top-left-input">
          <div>k =</div>
          <NumberInput number={k} setNumber={resetK} />
        </div>
        <div className="top-left-input">
          <div>n =</div>
          <NumberInput number={n} setNumber={resetN} />
        </div>
        <div className="top-left-input">
          <div>L =</div>
          <NumberInput number={l} setNumber={resetL} />
        </div>
      </div>
      <div className="top-right">
        <div className="top-right-label">Adders</div>
        {adders.map((adder, i) => (
          <div className="binary-input-array" key={i}>
            {adder.map((bit, j) => (
              <BinaryInput 
                isOn={bit}
                dispatchIsOn={() => flipAdderBit(i, j)}
                key={j}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="bottom">
      <div className="message">
        <div className="message-label">Encoded message:</div>
        <div className="has-validation">
          <input type="text" className={"form-control" + (isMessageValid ? "" : " is-invalid")} value={message} onChange={updateEncodedMessage} />
          <div className="invalid-feedback">{invalidMessage}</div>
        </div>
      </div>
      <div>
        <div className="btn btn-primary" onClick={decode}>Decode</div>
      </div>
      <div className="message">
        <div className="message-label">Corrected encoded message:</div>
        <input type="text" className="form-control" value={correctedMessage} readOnly={true} />
      </div>
      <div className="message">
        <div className="message-label">Original unencoded message:</div>
        <input type="text" className="form-control" value={originalMessage} readOnly={true} />
      </div>
    </div>
  </div>
}