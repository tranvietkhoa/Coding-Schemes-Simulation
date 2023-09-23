/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import { useHammingContext } from "../../pages/hamming/context"
import NumberInput from "../numberinput/NumberInput";
import BinaryInput from "../numberinput/BinaryInput";
import { css } from "@emotion/react";


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
            <button className="btn btn-primary" onClick={encodeMessage}>Encode</button>
            <button className="btn btn-danger" onClick={() => {
                resetRawMessage();
                setIsEncoded(false);
            }}>Reset</button>
        </div>
        {isEncoded && <div css={messageDivStyle}>
            <div>Encoded message:</div>
            <div css={messageBodyStyle}>
                <div css={messageContentStyle}>
                    {encodedMessage.map((bitInfo, bitIndex) => (
                        <BinaryInput 
                            isOn={bitInfo.value}
                            key={bitIndex}
                            isEmpty={!bitInfo.show}
                        />
                    ))}
                </div>
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

export const messageContentStyle = css`
    display: flex;
    flex-direction: row;
`;

export const hammingCommandStyle = css`
    display: flex;
    flex-direction: row;
    gap: 20px;
`
