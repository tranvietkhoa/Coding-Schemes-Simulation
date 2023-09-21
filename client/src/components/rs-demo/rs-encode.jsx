import { useCallback, useState } from 'react';
import { useReedSolomonContext } from '../../pages/reed-solomon/context';
import NumberInput from '../numberinput/NumberInput';
import NumberReader from '../numberinput/number-reader';
import './rs-encode.css';

export default function RSEncode() {
    const { rawMessage, setRawBit, encodedMessage, setEncodedMessage, resetRawMessage } = useReedSolomonContext();
    const [isEncoded, setIsEncoded] = useState(false);
    const [isMultiplied, setIsMultiplied] = useState(false);
    const [multiple, setMultiple] = useState([]);

    const encodeMessage = useCallback(() => {
        fetch(`/reed-solomon/encode?message=${rawMessage.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                const result = res.split(' ').map(bit => Number(bit));
                setEncodedMessage(result);
                setIsEncoded(true);
                setIsMultiplied(false);
            });
    }, [rawMessage, setEncodedMessage]);

    const handleResetRawMessage = useCallback(() => {
        resetRawMessage();
        setIsEncoded(false);
    }, [resetRawMessage]);

    const handleMultiply = useCallback(() => {
        fetch(`/reed-solomon/encode-multiply?message=${rawMessage.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                const result = res.split(' ').map(bit => Number(bit));
                setMultiple(result);
                setIsMultiplied(true);
            });
    }, [rawMessage]);

    const handleRemainder = useCallback(() => {
        fetch(`/reed-solomon/encode-remainder?message=${multiple.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                const result = res.split(' ').map(bit => Number(bit));
                setEncodedMessage(result);
                setIsEncoded(true);
            })
    }, [multiple]);

    return <div className="rs-encode">
        <div className="rs-encode-demo">
            <div className="rs-raw-message">
                <div className="rs-label">Raw message:</div>
                <div className="raw-message">
                    {rawMessage.map((number, numberIndex) => (
                        <NumberInput
                            number={number}
                            setNumber={(value) => {
                                setRawBit(numberIndex, value);
                            }}
                            ignoreZero={true}
                            key={numberIndex}
                        />
                    ))}
                </div>
            </div>
            <div className="rs-actions">
                <button className="btn btn-success" onClick={handleMultiply}>Multiply</button>
                <button className="btn btn-danger" onClick={handleResetRawMessage}>Reset</button>
                <button className="btn btn-primary" onClick={encodeMessage}>Encode</button>
            </div>
            {isMultiplied && <div className="rs-multiple">
                <div className="rs-label">Multiplied:</div>
                <div className="encoded-message">
                    {multiple.map((bit, bitIndex) => (
                        <NumberReader number={bit} key={bitIndex} />
                    ))}
                </div>
                <div className="rs-actions">
                    <button className="btn btn-primary" onClick={handleRemainder}>Encode</button>
                </div>
            </div>}
            {isEncoded && <div className="rs-encoded-message">
                <div className="rs-label">Encoded message:</div>
                <div className="encoded-message">
                    {encodedMessage.map((bit, bitIndex) => (
                        <NumberReader number={bit} key={bitIndex} />
                    ))}
                </div>
            </div>}
        </div>
    </div>;
}