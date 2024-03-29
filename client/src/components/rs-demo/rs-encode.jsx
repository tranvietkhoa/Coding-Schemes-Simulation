/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { useReedSolomonContext } from '../../pages/reed-solomon/context';
import NumberInput from '../numberinput/NumberInput';
import NumberReader from '../numberinput/number-reader';
import { css } from '@emotion/react';
import Button from '../button/button';

export default function RSEncode() {
    const {
        rawMessage,
        setRawBit,
        encodedMessage,
        setEncodedMessage,
        resetRawMessage,
        k,
        n,
        gx,
        fieldSize,
    } = useReedSolomonContext();
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
        setIsMultiplied(false);
    }, [resetRawMessage]);

    const handleMultiply = useCallback(() => {
        setMultiple([...Array(n - k).fill(0), ...rawMessage]);
        setIsMultiplied(true);
    }, [rawMessage, k, n]);

    const handleRemainder = useCallback(() => {
        let highestDeg = n - 1;
        while (multiple[highestDeg] === 0 && highestDeg > 0) {
            highestDeg--;
        }
        if (highestDeg < gx.length) {
            setEncodedMessage(multiple);
            setIsEncoded(true);
            return;
        }

        const remainder = [...multiple];
        for (let i = highestDeg; i >= gx.length - 1; i--) {
            const coeff = remainder[i];
            for (let j = 1; j <= gx.length; j++) {
                remainder[i + 1 - j] = (remainder[i + 1 - j] - coeff * gx[gx.length - j]) % fieldSize;
            }
        }
        const result = multiple.map((a, i) => a - remainder[i]);

        setEncodedMessage(result);
        setIsEncoded(true);
    }, [multiple, setEncodedMessage, n, gx, fieldSize]);

    return <div css={rsStyle}>
        <div css={instructionStyle}>
            <div css={instructionTextStyle}>For encoding, the message are treated as coefficients of polynomial, i.e. ax^2 + bx + c. The message is then multiplied by x^4.</div>
            <div css={instructionTextStyle}>The generator polynomial is:</div>
            <div css={middleStyle}>g(x) = (x - 3)(x - 9)(x - 27)(x - 81) = x^4 + 809x^3 + 723x^2 + 568x + 522</div>
            <div css={instructionTextStyle}>Note that coefficients are taken remainder modulo the field size, 929. Remainder of the multiplied polynomial is taken modulo the generator polynomial, and the difference is taken, so that the encoded message is a multiple of the generator polynomial.</div>
        </div>
        <div css={mainStyle}>
            <div css={messageStyle}>
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
                <Button onClick={handleMultiply} variant="green" text="multiply" />
                <Button onClick={handleResetRawMessage} variant="red" text="reset" />
                <Button onClick={encodeMessage} variant="blue" text="encode" />
            </div>
            {isMultiplied && <div css={messageStyle}>
                <div>Multiplied:</div>
                <div css={encodedMessageStyle}>
                    {multiple.map((bit, bitIndex) => (
                        <NumberReader number={bit} key={bitIndex} />
                    ))}
                </div>
                <div css={actionsStyle}>
                    <Button onClick={handleRemainder} variant="green" text="take remainder" />
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
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const instructionStyle = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const instructionTextStyle = css`
    text-align: justify;
`;

export const middleStyle = css`
    align-self: center;
`;

const mainStyle = css`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const messageStyle = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
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
