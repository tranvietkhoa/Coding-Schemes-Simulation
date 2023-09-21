import { useCallback, useState } from "react";
import { useReedSolomonContext } from "../../pages/reed-solomon/context";
import NumberInput from "../numberinput/NumberInput";
import './rs-encode.css';
import NumberReader from "../numberinput/number-reader";


export default function RSDecode() {
    const { rawMessage, encodedMessage, setEncodedBit, resetEncoded, setRawMessage } = useReedSolomonContext();
    const [isShowRaw, setIsShowRaw] = useState(false);
    const [correctedMessage, setCorrectMessage] = useState([]);

    const handleDecode = useCallback(() => {
        fetch(`/reed-solomon/decode?encoded=${encodedMessage.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                const [corrected, raw] = res.split('\n');
                setRawMessage(raw.split(' ').map(number => Number(number)));
                setCorrectMessage(corrected.split(' ').map(number => Number(number)));
                setIsShowRaw(true);
            });
    }, [encodedMessage, setRawMessage]);

    return <div className="rs-decode">
        <div className="rs-decode-demo">
            <div className="rs-encoded-message">
                <div className="rs-label">Encoded message:</div>
                <div className="raw-message">
                    {encodedMessage.map((number, numberIndex) => (
                        <NumberInput
                            number={number}
                            setNumber={(value) => setEncodedBit(numberIndex, value)}
                            ignoreZero={true}
                            key={numberIndex}
                        />
                    ))}
                </div>
            </div>
            <div className="rs-actions">
                <button className="btn btn-danger" onClick={resetEncoded}>Reset</button>
                <button className="btn btn-primary" onClick={handleDecode}>Decode</button>
            </div>
            {isShowRaw && <div className="rs-encoded-message">
                <div className="rs-label">Corrected message:</div>
                <div className="encoded-message">
                    {correctedMessage.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
            </div>}
            {isShowRaw && <div className="rs-raw-message">
                <div className="rs-label">Decoded raw message:</div>
                <div className="encoded-message">
                    {rawMessage.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
            </div>}
        </div>
    </div>;
}