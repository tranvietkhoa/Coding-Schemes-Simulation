/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import { useReedSolomonContext } from "../../pages/reed-solomon/context";
import NumberInput from "../numberinput/NumberInput";
import NumberReader from "../numberinput/number-reader";
import { actionsStyle, encodedMessageStyle, rawMessageStyle, rsStyle } from "./rs-encode";
import Button from '../button/button';


export default function RSDecode() {
    const { rawMessage, encodedMessage, setEncodedBit, resetEncoded, setRawMessage } = useReedSolomonContext();
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

    const handleReset = useCallback(() => {
        resetEncoded();
        setIsShowRaw(false);
    }, [resetEncoded]);

    const handleSyndrome = useCallback(() => {
        fetch(`/reed-solomon/syndrome?encoded=${encodedMessage.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                setSyndrome({
                    value: res.split(' ').map(number => Number(number)),
                    show: true,
                });
            });
    }, [encodedMessage]);

    const handleLocator = useCallback(() => {
        fetch(`/reed-solomon/locator?syndrome=${syndrome.value.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                setLocator({
                    value: res.split(' ').map(number => Number(number)),
                    show: true,
                });
            });
    }, [syndrome]);

    const handleQuadratic = useCallback(() => {
        fetch(`/reed-solomon/quadratic?locator=${locator.value.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                setQuadratic({
                    value: res.split(' ').map(number => Number(number)),
                    show: true,
                });
            });
    }, [locator]);

    const handleLocation = useCallback(() => {
        fetch(`/reed-solomon/location?quad=${quadratic.value.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                setLocation({
                    value: res.split(' ').map(number => Number(number)),
                    show: true,
                });
            });
    }, [quadratic]);

    const handleForney = useCallback(() => {
        fetch(`/reed-solomon/forney?quad=${quadratic.value.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                setForney({
                    value: res.split(' ').map(number => Number(number)),
                    show: true,
                });
            });
    }, [quadratic]);

    const handleError = useCallback(() => {
        fetch(`/reed-solomon/error?forney=${
            forney.value.reduce((prev, curr) => prev + ' ' + curr)
        }&location=${location.value.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                setError({
                    value: res.split(' ').map(number => Number(number)),
                    show: true,
                });
            });
    }, [forney, location]);

    const handleSubtract = useCallback(() => {
        fetch(`/reed-solomon/subtract?received=${
            encodedMessage.reduce((prev, curr) => prev + ' ' + curr)
        }&error=${error.value.reduce((prev, curr) => prev + ' ' + curr)}`)
            .then(res => res.text())
            .then(res => {
                const numbers = res.split(' ').map(number => Number(number));
                setCorrectMessage(numbers);
                setIsShowRaw(true);
                setRawMessage(numbers.slice(-3));
            });
    }, [encodedMessage, error, setRawMessage]);

    return <div css={rsStyle}>
        <div>
            <div>
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
            {syndrome.show && <div>
                <div>Syndrome:</div>
                <div css={encodedMessageStyle}>
                    {syndrome.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleLocator} variant="green" text="get locator" />
            </div>}
            {locator.show && <div>
                <div>Locator:</div>
                <div css={encodedMessageStyle}>
                    {locator.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleQuadratic} variant="green" text="get quadratic solutions" />
            </div>}
            {quadratic.show && <div>
                <div>Quadratic solution:</div>
                <div css={encodedMessageStyle}>
                    {quadratic.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleLocation} variant="green" text="get location" />
            </div>}
            {location.show && <div>
                <div>Error location:</div>
                <div css={encodedMessageStyle}>
                    {location.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleForney} variant="green" text="get Forney results" />
            </div>}
            {forney.show && <div>
                <div>Forney results:</div>
                <div css={encodedMessageStyle}>
                    {forney.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleError} variant="green" text="get error" />
            </div>}
            {error.show && <div>
                <div>Error:</div>
                <div css={encodedMessageStyle}>
                    {error.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <Button onClick={handleSubtract} variant="green" text="get original" />
            </div>}
            {isShowRaw && <div>
                <div>Corrected message:</div>
                <div css={encodedMessageStyle}>
                    {correctedMessage.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
            </div>}
            {isShowRaw && <div>
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