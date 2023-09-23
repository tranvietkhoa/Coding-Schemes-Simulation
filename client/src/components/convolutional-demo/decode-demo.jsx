/** @jsxImportSource @emotion/react */
import { useState, useCallback, useEffect } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import { useConvolutionalContext } from '../../pages/convolutional/context';
import { binaryInputArrayStyle } from './encode-demo';
import { css } from '@emotion/react';

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
    setStepCountToZero,
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
  }, [k, n, l, adders, message, setOriginalMessage]);

  useEffect(() => {
    setStepCountToZero();
  }, [setStepCountToZero]);

  return <div css={rootStyle}>
    <div css={topStyle}>
      <div css={topLeftStyle}>
        <div css={topLeftInput}>
          <div>k =</div>
          <NumberInput number={k} setNumber={resetK} />
        </div>
        <div css={topLeftInput}>
          <div>n =</div>
          <NumberInput number={n} setNumber={resetN} />
        </div>
        <div css={topLeftInput}>
          <div>L =</div>
          <NumberInput number={l} setNumber={resetL} />
        </div>
      </div>
      <div css={topRightStyle}>
        <div>Adders</div>
        {adders.map((adder, i) => (
          <div css={binaryInputArrayStyle} key={i}>
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
    <div css={bottomStyle}>
      <div css={messageStyle}>
        <div>Encoded message:</div>
        <div css={binaryInputArrayStyle}>
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
      <div css={messageStyle}>
        <div>Corrected encoded message:</div>
        <input css={messageInputStyle} type="text" className="form-control" value={correctedMessage} readOnly={true} />
      </div>
      <div css={messageStyle}>
        <div>Original unencoded message:</div>
        <input css={messageInputStyle} type="text" className="form-control" value={inputStream.map(bit => bit ? '1' : '0').reduce((prev, curr) => prev + curr, '')} readOnly={true} />
      </div>
    </div>
  </div>
}

const rootStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  user-select: none;
`;

const topStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const topLeftStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const topLeftInput = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const topRightStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 50%;
`;

const bottomStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const messageStyle = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const messageInputStyle = css`
  width: 400px;
`;
