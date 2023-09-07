import { useState, useRef, useEffect, Fragment } from 'react';
import NumberInput from '../numberinput/NumberInput';
import BinaryInput from '../numberinput/BinaryInput';
import { CustomArrow } from '../customarrow/arrow';
import { useEncodeContext } from '../../pages/demo';
import './convolutional-demo.css';
import { useConvolutionalContext } from '../../pages/convolutional/context';

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
        setInputArrayRight(inputArrayRect.right);
        setInputArrayBottom(inputArrayRect.bottom);
      };
      setTimeout(callback, 100);
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    }
  }, [isContentLoading]);

  useEffect(() => {
    resetSimulation();
  }, []);

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
        <button className="btn btn-success" onClick={simulateEncode}>result</button>
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
        setStartX(inputArrayRect.right);
        setEndX(resultBoxRect.left);
        setStartY((inputArrayRect.top + inputArrayRect.bottom) / 2);
        setEndY((resultBoxRect.top + resultBoxRect.bottom) / 2);
        setArrEndX(inputArrayRect.right - boxWidth * l / 2);
        setArrEndY(inputArrayRect.top);
      };
      setTimeout(callback, 100);
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
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