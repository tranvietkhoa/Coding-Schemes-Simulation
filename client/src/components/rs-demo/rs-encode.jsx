/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { useReedSolomonContext } from '../../pages/reed-solomon/context';
import NumberInput from '../numberinput/NumberInput';
import NumberReader from '../numberinput/number-reader';
import { css } from '@emotion/react';

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
    }, [multiple, setEncodedMessage]);

    return <div css={rsStyle}>
        <div>
            <div>
                <div>Raw message:</div>
                <div css={rawMessageStyle}>
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
            <div css={actionsStyle}>
                <button className="btn btn-success" onClick={handleMultiply}>Multiply</button>
                <button className="btn btn-danger" onClick={handleResetRawMessage}>Reset</button>
                <button className="btn btn-primary" onClick={encodeMessage}>Encode</button>
            </div>
            {isMultiplied && <div>
                <div>Multiplied:</div>
                <div css={encodedMessageStyle}>
                    {multiple.map((bit, bitIndex) => (
                        <NumberReader number={bit} key={bitIndex} />
                    ))}
                </div>
                <div css={actionsStyle}>
                    <button className="btn btn-success" onClick={handleRemainder}>Take remainder</button>
                </div>
            </div>}
            {isEncoded && <div>
                <div>Encoded message:</div>
                <div css={encodedMessageStyle}>
                    {encodedMessage.map((bit, bitIndex) => (
                        <NumberReader number={bit} key={bitIndex} />
                    ))}
                </div>
            </div>}
        </div>
    </div>;
}

export const rsStyle = css`
    padding: 10px;
`;

export const rawMessageStyle = css`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

export const encodedMessageStyle = css`
    display: flex;
    flex-direction: row;
`;

export const actionsStyle = css`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;
