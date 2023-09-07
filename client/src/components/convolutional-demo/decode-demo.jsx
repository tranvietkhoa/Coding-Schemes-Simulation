import './convolutional-decode.css';
import { useState, useCallback, useReducer } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import { useConvolutionalContext } from '../../pages/convolutional/context';

export default function ConvolutionalDecodeDemo() {
  const {
    k,
    n,
    l,
    resetK,
    resetN,
    resetL,
    inputStream,
    adders,
    message,
    flipEncodedBit,
    flipAdderBit,
    setOriginalMessage,
  } = useConvolutionalContext();
  const [correctedMessage, setCorrectedMessage] = useState('');

  const decode = useCallback(() => {
    fetch(`/convolutional/decode?k=${k}&n=${n}&L=${l}&${
      adders.map(adder => 'adders[]=' + adder.adder.reduce((prev, bit) => prev + (bit ? '1' : '0'), ''))
        .reduce((prev, curr) => (prev + '&' + curr))
    }&message=${
      message.map(bit => bit ? '1' : '0').reduce((prev, curr, i) => prev + (i % n === 0 ? ' ' : '') + curr)
    }`)
      .then(response => response.json())
      .then(res => {
        setOriginalMessage(res.original.split('').map(bit => bit === '1'));
        setCorrectedMessage(res.corrected);
      })
  }, [k, n, l, adders, message]);

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
            {adder.adder.map((bit, j) => (
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
        <div className="binary-input-array">
          {message.map((bit, bitIndex) => (
            <BinaryInput
              isOn={bit}
              key={bitIndex}
              dispatchIsOn={() => flipEncodedBit(bitIndex)}
            />
          ))}
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
        <input type="text" className="form-control" value={inputStream.map(bit => bit ? '1' : '0').reduce((prev, curr) => prev + curr, '')} readOnly={true} />
      </div>
    </div>
  </div>
}