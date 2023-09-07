import { useCallback } from "react";
import { useHammingContext } from "../../pages/hamming/context"
import NumberInput from "../numberinput/NumberInput";
import BinaryInput from "../numberinput/BinaryInput";
import './hamming-encode.css';


export default function HammingEncode() {
    const { 
        rawMessage, 
        encodedMessage, 
        increaseRawMessageLength, 
        decreaseRawMessageLength, 
        flipRawMessageBit,
        encodeRawMessage, 
        resetRawMessage, 
        resetEncodeSimulation 
    } = useHammingContext();

    const setRawLength = useCallback((newLength) => {
        if (newLength > rawMessage.length) {
            increaseRawMessageLength();
        } else if (newLength < rawMessage.length) {
            decreaseRawMessageLength();
        }
    }, [rawMessage]);

    return <div className="hamming-demo">
        <div className="message-div">
            <div className="message-header">Raw message:</div>
            <div className="message-body">
                <div className="message-number">
                    <NumberInput number={rawMessage.length} setNumber={setRawLength} />
                </div>
                <div className="message-content">
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
        <div className="message-div">
            <div className="message-header">Encoded message:</div>
            <div className="message-body">
                <div className="message-content">
                    {encodedMessage.map((bitInfo, bitIndex) => (
                        <BinaryInput 
                            isOn={bitInfo.value}
                            key={bitIndex}
                            isEmpty={!bitInfo.show}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>;
}