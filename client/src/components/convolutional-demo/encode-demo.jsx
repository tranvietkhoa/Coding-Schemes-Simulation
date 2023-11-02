/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, Fragment } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import { CustomArrow } from '../customarrow/arrow';
import { useEncodeContext } from '../../pages/demo';
import { useConvolutionalContext } from '../../pages/convolutional/context';
import { css } from '@emotion/react';
import Button from '../button/button';

export default function ConvolutionalEncodeDemo() {
  const {
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
  } = useConvolutionalContext();

  const boxWidth = 40;
  const inputArray = useRef(null);
  const [inputArrayRight, setInputArrayRight] = useState(0);
  const [inputArrayBottom, setInputArrayBottom] = useState(0);
  const { isContentLoading } = useEncodeContext();

  useEffect(() => {
    if (!isContentLoading) {
      const callback = () => {
        const inputArrayRect = inputArray.current.getBoundingClientRect();
        setInputArrayRight(inputArray.current.offsetLeft + (inputArrayRect.right - inputArrayRect.left));
        setInputArrayBottom(inputArray.current.offsetTop + (inputArrayRect.bottom - inputArrayRect.top));
      };
      setTimeout(callback, 100);
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    }
  }, [isContentLoading]);

  useEffect(() => {
    resetSimulation();
  }, [resetSimulation]);

	return (
		<div css={rootStyle}>
      <div css={encodeBoxStyle}>
        <div css={klBoxContainerStyle}>
          <div css={numberInputIndicatorStyle}>
            <div>k =</div>
            <NumberInput number={k} setNumber={resetK} />
          </div>
          <div css={binaryInputArrayStyle}>
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
        <div css={[klBoxContainerStyle, boxRightStyle]}>
          <div css={numberInputIndicatorStyle}>
            <div>L =</div>
            <NumberInput number={l} setNumber={resetL} />
          </div>
          <div css={binaryInputArrayStyle} ref={inputArray}>
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
      <div css={encodeBoxStyle}>
        <div css={nBoxStyle}>
          <div css={[numberInputIndicatorStyle, nIndicatorStyle]}>
            <div>n =</div>
            <NumberInput number={n} setNumber={resetN} />
          </div>
        </div>
        <div css={addersStyle}>
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
      <div css={encodeBoxStyle}>
        <div id="encode-message">
          <div>Message:</div>
          <div css={binaryInputArrayStyle}>
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
      <div css={buttonsStyle}>
        <Button onClick={resetSimulation} text="reset simulation" variant="red" />
        <Button onClick={simulateNextStep} text="next step" variant="blue" />
        <Button onClick={simulateEncode} text="result" variant="green" />
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
      const callback = () => {
        const inputArrayRect = inputArray.current.getBoundingClientRect();
        const resultBoxRect = resultBox.current.getBoundingClientRect();
        setStartX(inputArray.current.offsetLeft + (inputArrayRect.right - inputArrayRect.left));
        setEndX(resultBox.current.offsetLeft);
        setStartY(resultBox.current.offsetTop + (resultBoxRect.bottom - resultBoxRect.top) / 2);
        setEndY(resultBox.current.offsetTop + (resultBoxRect.bottom - resultBoxRect.top) / 2);
        setArrEndX(inputArray.current.offsetLeft + (inputArrayRect.right - inputArrayRect.left) - boxWidth * l / 2);
        setArrEndY(inputArray.current.offsetTop);
      };
      setTimeout(callback, 100);
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    }
  }, [boxWidth, l, isContentLoading]);
  
  return <div css={adderStyle}>
    <div css={binaryInputArrayStyle} ref={inputArray}>
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
    <div ref={resultBox}>
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

const rootStyle = css`
  display: flex;
  flex-direction: column;
  gap: 30px;
  user-select: none;
  position: relative;
`;

const encodeBoxStyle = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const binaryInputArrayStyle = css`
  display: flex;
  flex-direction: row;
`;

const klBoxContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const numberInputIndicatorStyle = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const boxRightStyle = css`
  padding-right: 100px;
  align-items: flex-end;
`;

const adderStyle = css`
  display: flex;
  flex-direction: row;
  gap: 30px;
`;

const nBoxStyle = css`
  align-self: start;
`;

const nIndicatorStyle = css`
  width: fit-content;
  margin: auto;
`;

const addersStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const buttonsStyle = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
