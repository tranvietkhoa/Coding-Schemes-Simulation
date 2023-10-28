/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import { useHammingContext } from "../../pages/hamming/context";
import NumberInput from "../numberinput/NumberInput";
import BinaryInput from "../numberinput/BinaryInput";
import { hammingCommandStyle, hammingStyle, messageBodyStyle, messageContentStyle, messageDivStyle } from "./hamming-encode";
import Button from '../button/button';


export default function HammingDecode() {
    const {
        rawMessage,
        encodedMessage,
        savedEncodedMessage,
        increaseEncodedMessageLength,
        decreaseEncodedMessageLength,
        flipEncodedMessageBit,
        resetEncodedMessage,
        decodeMessage,
    } = useHammingContext();
    const [isDecoded, setIsDecoded] = useState(false);

    const setEncodedLength = useCallback(newLength => {
        if (newLength > encodedMessage.length) {
            increaseEncodedMessageLength();
        } else if (newLength < encodedMessage.length) {
            decreaseEncodedMessageLength();
        }
    }, [encodedMessage, increaseEncodedMessageLength, decreaseEncodedMessageLength]);

    const turnHamming = useCallback(message => {
        let r = 0;
        while (Math.pow(2, r) - 1 < message.length) {
            r += 1;
        }
        return message + '0'.repeat(Math.pow(2, r) - 1 - message.length);
    }, []);

    const decode = useCallback(() => {
        fetch(`/hamming/decode?message=${turnHamming(encodedMessage.map(bitInfo => bitInfo.value ? '1' : '0').reduce((prev, curr) => prev + curr))}`)
            .then(res => res.json())
            .then(res => {
                decodeMessage(
                    res.corrected.split('').map(char => char === '1'),
                    res.original.split('').map(char => char === '1'),
                );
                setIsDecoded(true);
            });
    }, [encodedMessage, decodeMessage, turnHamming]);

    return <div css={hammingStyle}>
        <div css={messageDivStyle}>
            <div>Encoded message</div>
            <div css={messageBodyStyle}>
                <div>
                    <NumberInput number={encodedMessage.length} setNumber={setEncodedLength} />
                </div>
                <div css={messageContentStyle}>
                    {encodedMessage.map((bitInfo, bitIndex) => (
                        <BinaryInput
                            isOn={bitInfo.value}
                            key={bitIndex}
                            dispatchIsOn={() => flipEncodedMessageBit(bitIndex)}
                        />
                    ))}
                </div>
            </div>
        </div>
        <div css={hammingCommandStyle}>
            <Button onClick={decode} variant="blue" text="decode" />
            <Button variant="red" text="reset" onClick={() => {
                resetEncodedMessage();
                setIsDecoded(false);
            }} />
        </div>
        {isDecoded && <><div css={messageDivStyle}>
            <div>Corrected encoded message:</div>
            <div css={messageBodyStyle}>
                <div css={messageContentStyle}>
                    {savedEncodedMessage.map((bitInfo, bitIndex) => (
                        <BinaryInput
                            isOn={bitInfo.value}
                            key={bitIndex}
                        />
                    ))}
                </div>
            </div>
        </div>
        <div css={messageDivStyle}>
            <div>Original message:</div>
            <div css={messageBodyStyle}>
                <div css={messageContentStyle}>
                    {rawMessage.map((bit, bitIndex) => (
                        <BinaryInput
                            isOn={bit}
                            key={bitIndex}
                        />
                    ))}
                </div>
            </div>
        </div></>}
    </div>;
}