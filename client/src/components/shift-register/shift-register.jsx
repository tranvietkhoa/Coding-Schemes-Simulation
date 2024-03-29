/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useRef, useState } from "react";
import BinaryInput from "../numberinput/BinaryInput";
import { css } from "@emotion/react";
import { CustomArrow } from "../customarrow/arrow";

export default function ShiftRegister() {
    const [bits, setBits] = useState(Array(8).fill(0));
    const [chosen, setChosen] = useState(Array(8).fill(false));
    const result = useMemo(() => (
        bits.map((bit, bitIndex) => chosen[bitIndex] ? bit : 0)
            .reduce((u, v) => u ^ v)
    ), [bits, chosen]);
    const outputRef = useRef(null);
    const [arrowDest, setArrowDest] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        setBits(bits => bits.map(() => Math.round(Math.random())));
        setChosen(chosens => chosens.map(() => Math.round(Math.random()) > 0.5));
        const outputRect = outputRef.current.getBoundingClientRect();
        setArrowDest({
            x: outputRef.current.offsetLeft + (outputRect.right - outputRect.left) / 2,
            y: outputRef.current.offsetTop,
        });
    }, []);

    return <div css={shiftRegisterCss}>
        <div css={bitArrayCss}>
            {bits.map((bit, bitIndex) => (
                <ShiftRegisterBit
                    bitValue={bit}
                    setBitValue={() => setBits(bits => 
                        bits.map((bit, i) => i === bitIndex ? 1 - bit : bit))}
                    isChosen={chosen[bitIndex]}
                    setIsChosen={() => setChosen(chosen => 
                        chosen.map((bit, i) => i === bitIndex ? !bit : bit))}
                    arrowDest={arrowDest}
                    key={bitIndex}
                />
            ))}
        </div>
        <div ref={outputRef}>
            <BinaryInput isOn={result} />
        </div>
    </div>;
}

const ShiftRegisterBit = ({ bitValue, setBitValue, isChosen, setIsChosen, arrowDest }) => {
    const boxRef = useRef(null);
    const [arrowStart, setArrowStart] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const boxRect = boxRef.current.getBoundingClientRect();
        setArrowStart({
            x: boxRef.current.offsetLeft + (boxRect.right - boxRect.left) / 2,
            y: boxRef.current.offsetTop + (boxRect.bottom - boxRect.top),
        })
    }, []);

    return <div css={bitContainerCss} ref={boxRef}>
        <input
            type="checkbox" 
            onChange={setIsChosen}
            checked={isChosen}
        />
        <BinaryInput
            isOn={bitValue} 
            dispatchIsOn={setBitValue}
        />
        {isChosen && <CustomArrow start={arrowStart} end={arrowDest} />}
    </div>;
}

const shiftRegisterCss = css`
    display: flex;
    flex-direction: column;
    gap: 70px;
    align-items: center;
    position: relative;
`;

const bitArrayCss = css`
    display: flex;
    flex-direction: row;
`;

const bitContainerCss = css`
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: center;
`;
