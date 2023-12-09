/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from "react";
import { useHammingContext } from "../../pages/hamming/context"
import NumberInput from "../numberinput/NumberInput";
import BinaryInput from "../numberinput/BinaryInput";
import { css } from "@emotion/react";
import Button from "../button/button";
import { ParityBits } from "../parity/parity";


export default function HammingEncode() {
    const { 
        rawMessage, 
        encodedMessage, 
        increaseRawMessageLength, 
        decreaseRawMessageLength, 
        flipRawMessageBit,
        encodeRawMessage, 
        resetRawMessage, 
    } = useHammingContext();
    const [isEncoded, setIsEncoded] = useState(false);
    const r = useMemo(() => {
        let res = 0;
        while (Math.pow(2, res) - 1 < encodedMessage.length) {
            res += 1;
        }
        return res;
    }, [encodedMessage]);

    const setRawLength = useCallback((newLength) => {
        if (newLength > rawMessage.length) {
            increaseRawMessageLength();
        } else if (newLength < rawMessage.length) {
            decreaseRawMessageLength();
        }
    }, [rawMessage, increaseRawMessageLength, decreaseRawMessageLength]);

    const encodeMessage = useCallback(() => {
        fetch(`/hamming/encode?message=${rawMessage.map(bit => bit ? '1' : '0').reduce((prev, curr) => prev + curr)}`)
            .then(res => res.json())
            .then(res => {
                encodeRawMessage(
                    res.raw.split('').map(char => char === '1'),
                    res.encoded.split('').map(char => char === '1')
                );
                setIsEncoded(true);
            });
    }, [rawMessage, encodeRawMessage]);

    return <div css={hammingStyle}>
        <div>Encode your message here! Note that if your message is not of the correct length, the algorithm will automatically append zeros at the end.</div>
        <div css={messageDivStyle}>
            <div>Raw message:</div>
            <div css={messageBodyStyle}>
                <div>
                    <NumberInput number={rawMessage.length} setNumber={setRawLength} />
                </div>
                <div css={messageContentStyle}>
                    {rawMessage.map((bit, bitIndex) => (
                        <BinaryInput 
                            isOn={bit} 
                            key={bitIndex}
                            dispatchIsOn={() => flipRawMessageBit(bitIndex)} 
                        />
                    ))}
                </div>
            </div>
        </div>
        <div css={hammingCommandStyle}>
            <Button onClick={encodeMessage} variant="blue" text="encode" />
            <Button variant="red" text="reset" onClick={() => {
                resetRawMessage();
                setIsEncoded(false);
            }} />
        </div>
        {isEncoded && <div css={messageDivStyle}>
            <div>Encoded message:</div>
            <div css={encodedMessageBodyStyle}>
                <div css={messageContentStyle}>
                    {encodedMessage.map((bitInfo, bitIndex) => (
                        <BinaryInput 
                            isOn={bitInfo.value}
                            key={bitIndex}
                            isEmpty={!bitInfo.show}
                        />
                    ))}
                </div>
                <ParityBits n={r} showShort={true} />
            </div>
        </div>}
    </div>;
}

export const hammingStyle = css`
    user-select: none;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const messageDivStyle = css`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const messageBodyStyle = css`
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    padding-left: 10px;
`;

const encodedMessageBodyStyle = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const messageContentStyle = css`
    display: flex;
    flex-direction: row;
`;

export const hammingCommandStyle = css`
    display: flex;
    flex-direction: row;
    gap: 20px;
`
