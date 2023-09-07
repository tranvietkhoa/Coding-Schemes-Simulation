import { useCallback, useState } from "react";
import { useHammingContext } from "../../pages/hamming/context";
import NumberInput from "../numberinput/NumberInput";
import './hamming-encode.css';
import BinaryInput from "../numberinput/BinaryInput";


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
    }, [encodedMessage]);

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
    }, [encodedMessage]);

    return <div className="hamming-demo">
        <div className="message-div">
            <div className="message-header">Encoded message</div>
            <div className="message-body">
                <div className="message-number">
                    <NumberInput number={encodedMessage.length} setNumber={setEncodedLength} />
                </div>
                <div className="message-content">
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
        <div className="hamming-commands">
            <button className="btn btn-primary" onClick={decode}>Decode</button>
        </div>
        {isDecoded && <><div className="message-div">
            <div className="message-header">Corrected encoded message:</div>
            <div className="message-body">
                <div className="message-content">
                    {savedEncodedMessage.map((bitInfo, bitIndex) => (
                        <BinaryInput
                            isOn={bitInfo.value}
                            key={bitIndex}
                        />
                    ))}
                </div>
            </div>
        </div>
        <div className="message-div">
            <div className="message-header">Original message:</div>
            <div className="message-body">
                <div className="message-content">
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