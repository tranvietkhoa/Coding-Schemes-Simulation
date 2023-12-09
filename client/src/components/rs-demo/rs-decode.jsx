/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from "react";
import { useReedSolomonContext } from "../../pages/reed-solomon/context";
import NumberInput from "../numberinput/NumberInput";
import NumberReader from "../numberinput/number-reader";
import { actionsStyle, encodedMessageStyle, instructionStyle, instructionTextStyle, rawMessageStyle, rsStyle } from "./rs-encode";
import Button from '../button/button';
import { css } from "@emotion/react";


export default function RSDecode() {
    const {
        rawMessage,
        encodedMessage,
        setEncodedBit,
        resetEncoded,
        setRawMessage,
        k,
        n,
        s,
        primitiveElement,
        fieldSize,
    } = useReedSolomonContext();
    const [isShowRaw, setIsShowRaw] = useState(false);
    const [correctedMessage, setCorrectMessage] = useState([]);
    const [syndrome, setSyndrome] = useState({
        value: [],
        show: false,
    });
    const [locator, setLocator] = useState({
        value: [],
        show: false,
    });
    const [quadratic, setQuadratic] = useState({
        value: [],
        show: false,
    });
    const [location, setLocation] = useState({
        value: [],
        show: false,
    });
    const [forney, setForney] = useState({
        value: [],
        show: false,
    });
    const [error, setError] = useState({
        value: [],
        show: false,
    });

    const hideSteps = useCallback(() => {
        const updater = state => ({
            ...state,
            show: false,
        });
        setSyndrome(updater);
        setLocator(updater);
        setQuadratic(updater);
        setLocation(updater);
        setForney(updater);
        setError(updater);
    }, []);

    const handleDecode = useCallback(() => {
        fetch(`/reed-solomon/decode?encoded=${encodedMessage.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                const [corrected, raw] = res.split('\n');
                setRawMessage(raw.split(' ').map(number => Number(number)));
                setCorrectMessage(corrected.split(' ').map(number => Number(number)));
                setIsShowRaw(true);
                hideSteps();
            });
    }, [encodedMessage, setRawMessage, hideSteps]);

    const evalFxAt = useCallback((encodedMessage, a) => {
        let pow = 1;
        let res = 0;
        for (let i = 0; i < encodedMessage.length; i ++) {
            res += pow * encodedMessage[i];
            res %= fieldSize;
            pow *= a;
            pow %= fieldSize;
        }
        return res;
    }, [fieldSize]);

    const handleReset = useCallback(() => {
        resetEncoded();
        hideSteps();
        setIsShowRaw(false);
    }, [resetEncoded, hideSteps]);

    const handleSyndrome = useCallback(() => {
        const newSyndrome = [];
        let pow = 1;
        for (let i = 0; i < 2 * s; i++) {
            pow *= primitiveElement;
            newSyndrome.push(evalFxAt(encodedMessage, pow));
        }
        setSyndrome({
            value: newSyndrome,
            show: true,
        });
    }, [encodedMessage, evalFxAt, s, primitiveElement]);

    const findB = useCallback((a, c) => {
        let b = 0;
        while (a * b % fieldSize !== c) {
            b++;
        }
        return b;
    }, [fieldSize]);

    const handleLocator = useCallback(() => {
        const A = Array(s).fill();
        for (let i = 0; i < s; i++) {
            A[i] = Array(s + 1).fill();
        }
        for (let i = 0; i < s; i++) {
            for (let j = 0; j < s; j++) {
                A[i][j] = syndrome.value[i + j];
                if (A[i][j] < 0) {
                    A[i][j] += fieldSize;
                }
            }
        }
        for (let i = 0; i < s; i++) {
            A[i][s] = -syndrome.value[i + s];
            if (A[i][s] < 0) {
                A[i][s] += fieldSize;
            }
        }

        for (let i = 0; i < s; i++) {
            if (A[i][i] === 0) {
                for (let j = i + 1; j < s; j++) {
                    if (A[j][i] !== 0) {
                        for (let l = 0; l <= s; l++) {
                            const temp = A[i][l];
                            A[i][l] = A[j][l];
                            A[j][l] = temp;
                        }
                        break;
                    }
                }
            }
            if (A[i][i] === 0) {
                continue;
            }

            for (let j = 0; j < s; j++) {
                if (i === j) {
                    continue;
                }
                const coeff = findB(A[i][i], A[j][i]);
                for (let l = i; l <= s; l++) {
                    A[j][l] = (A[j][l] - ((A[i][l] * coeff) % fieldSize)) % fieldSize;
                    if (A[j][l] < 0) {
                        A[j][l] += fieldSize;
                    }
                }
            }
        }

        const res = Array(s).fill();
        for (let i = 0; i < s; i++) {
            res[s - i - 1] = findB(A[i][i], A[i][s]);
        }
        setLocator({
            value: res,
            show: true,
        });
    }, [syndrome, s, fieldSize, findB]);

    const [expTable, logTable] = useMemo(() => {
        let curr = primitiveElement;
        const expTable = [];
        const logTable = [];
        for (let i = 0; i < fieldSize - 1; i++) {
            expTable[i] = curr;
            logTable[curr - 1] = i + 1;
            curr = (curr * primitiveElement) % fieldSize;
        }
        logTable[0] = 0;
        return [expTable, logTable];
    }, [primitiveElement, fieldSize]);

    const handleQuadratic = useCallback(() => {
        const a = locator.value[1];
        const b = locator.value[0];
        const c = 1;
        let first;
        let second;
        for (let i = 0; i < fieldSize - 1; i++) {
            if ((a * expTable[(2 * i + 1) % (fieldSize - 1)] + b * expTable[i] + c) % fieldSize === 0) {
                if (first === undefined) {
                    first = expTable[i];
                } else {
                    second = expTable[i];
                    break;
                }
            }
        }
        setQuadratic({
            value: [first, second],
            show: true,
        });
    }, [locator, fieldSize, expTable]);

    const handleLocation = useCallback(() => {
        let first;
        let second;
        for (let i = 0; i <= fieldSize; i++) {
            if (i * quadratic.value[0] % fieldSize === 1) {
                first = logTable[i - 1];
                break;
            }
        }
        for (let i = 0; i <= fieldSize; i++) {
            if (i * quadratic.value[1] % fieldSize === 1) {
                second = logTable[i - 1];
                break;
            }
        }
        setLocation({
            value: [first, second],
            show: true,
        });
    }, [quadratic, fieldSize, logTable]);

    const handleForney = useCallback(() => {
        const errEvaluator = [];
        const errLocator = [1, ...locator.value];
        for (let i = 0; i < 2 * s; i++) {
            let curr = 0;
            for (let j = i; j >= Math.max(i - 2, 0); j--) {
                curr += syndrome.value[j] * errLocator[i - j];
            }
            errEvaluator.push(curr % fieldSize);
        }
        const locatorDerivative = locator.value.map((coeff, i) => coeff * (i + 1) % fieldSize);
        
        let first;
        let second;
        for (let i = 0; i < fieldSize; i++) {
            if ((evalFxAt(errEvaluator, quadratic.value[0]) + evalFxAt(locatorDerivative, quadratic.value[0]) * i % fieldSize) % fieldSize === 0) {
                first = i;
                break;
            }
        }
        for (let i = 0; i < fieldSize; i++) {
            if ((evalFxAt(errEvaluator, quadratic.value[1]) + evalFxAt(locatorDerivative, quadratic.value[1]) * i % fieldSize) % fieldSize === 0) {
                second = i;
                break;
            }
        }
        setForney({
            value: [first, second],
            show: true,
        });
    }, [syndrome, locator, s, fieldSize, evalFxAt, quadratic]);

    const handleError = useCallback(() => {
        const errorDeterminer = (_, i) => (
            i === location.value[0]
            ? forney.value[0]
            : i === location.value[1]
            ? forney.value[1]
            : 0
        )
        setError({
            value: Array(n).fill().map(errorDeterminer),
            show: true,
        });
    }, [forney, location, n]);

    const handleSubtract = useCallback(() => {
        const res = encodedMessage.map((v, i) => (v - error.value[i] + fieldSize) % fieldSize);
        setCorrectMessage(res);
        setIsShowRaw(true);
        setRawMessage(res.slice(-k));
    }, [encodedMessage, error, setRawMessage, k, fieldSize]);

    return <div css={rsStyle}>
        <div css={instructionStyle}>
            <div css={instructionTextStyle}>Alter one or two numbers on the encoded message to see the decoding process. Remember that if the message is not corrupted, the polynomial is a multiple of the generator polynomial. Hence, we evaluate the syndrome by evaluating the polynomial at x = 3, 9, 27, 81. If one of them is non-zero, it indicates error.</div>
            <div css={instructionTextStyle}>Define the locator polynomial to be the polynomial whose roots are values whose log base primitive element are the positions of the errors (i.e. the indices). For example, if the errors are located at indices 2 and 4, the roots of the locator polynomial are 3^2 and 3^4. Here, the primitive element is 3.</div>
            <div css={instructionTextStyle}>By default, the  leading coefficient (i.e. highest-power) is 1 and hence is not displayed. Using the syndromes, we can deduce the coefficients of the locator polynomial, and solving the polynomial, in this case a quadratic equation, gives us the positions of the errors. Note that values are taken modulo 929, and hence the "roots" of the polynomial are those that make the polynomial evaluation to be divisible by 929.</div>
            <div css={instructionTextStyle}>Forney's algorithm is then used to determine the magnitude of errors that correspond to the positions of the errors. Forney's algorithm involves calculating the derivative of the locator polynomial, constructing the error evaluator polynomial from the locator polynomial and the syndromes, and then use those two to calculate the error magnitudes.</div>
            <div  css={instructionTextStyle}>From the error calculated, we can subtract to obtain the correct encoded message and the original message.</div>
        </div>
        <div css={blockCss}>
            <div css={infoBlockCss}>
                <div>Encoded message:</div>
                <div css={rawMessageStyle}>
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
            <div css={actionsStyle}>
                <Button onClick={handleSyndrome} variant="green" text="get syndrome" />
                <Button onClick={handleReset} variant="red" text="reset" />
                <Button onClick={handleDecode} variant="blue" text="decode" />
            </div>
            {syndrome.show && <div css={infoBlockCss}>
                <div>Syndrome:</div>
                <div css={encodedMessageStyle}>
                    {syndrome.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleLocator} variant="green" text="get locator" />
            </div>}
            {locator.show && <div css={infoBlockCss}>
                <div>Locator:</div>
                <div css={encodedMessageStyle}>
                    {locator.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleQuadratic} variant="green" text="get quadratic solutions" />
            </div>}
            {quadratic.show && <div css={infoBlockCss}>
                <div>Quadratic solution:</div>
                <div css={encodedMessageStyle}>
                    {quadratic.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleLocation} variant="green" text="get location" />
            </div>}
            {location.show && <div css={infoBlockCss}>
                <div>Error location:</div>
                <div css={encodedMessageStyle}>
                    {location.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleForney} variant="green" text="get Forney results" />
            </div>}
            {forney.show && <div css={infoBlockCss}>
                <div>Forney results:</div>
                <div css={encodedMessageStyle}>
                    {forney.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleError} variant="green" text="get error" />
            </div>}
            {error.show && <div css={infoBlockCss}>
                <div>Error:</div>
                <div css={encodedMessageStyle}>
                    {error.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleSubtract} variant="green" text="get original" />
            </div>}
            {isShowRaw && <div css={infoBlockCss}>
                <div>Corrected message:</div>
                <div css={encodedMessageStyle}>
                    {correctedMessage.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
            </div>}
            {isShowRaw && <div css={infoBlockCss}>
                <div>Decoded raw message:</div>
                <div css={encodedMessageStyle}>
                    {rawMessage.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
            </div>}
        </div>
    </div>;
}

const blockCss = css`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const infoBlockCss = css`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;
