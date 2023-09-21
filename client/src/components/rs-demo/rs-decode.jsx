import { useCallback, useState } from "react";
import { useReedSolomonContext } from "../../pages/reed-solomon/context";
import NumberInput from "../numberinput/NumberInput";
import './rs-encode.css';
import NumberReader from "../numberinput/number-reader";


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
                <button className="btn btn-success" onClick={handleSyndrome}>Get syndrome</button>
                <button className="btn btn-danger" onClick={handleReset}>Reset</button>
                <button className="btn btn-primary" onClick={handleDecode}>Decode</button>
            </div>
            {syndrome.show && <div className="rs-encoded-message">
                <div className="rs-label">Syndrome:</div>
                <div className="encoded-message">
                    {syndrome.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <button className="btn btn-success" onClick={handleLocator}>Get locator</button>
            </div>}
            {locator.show && <div className="rs-encoded-message">
                <div className="rs-label">Locator:</div>
                <div className="encoded-message">
                    {locator.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <button className="btn btn-success" onClick={handleQuadratic}>Get quadratic solutions</button>
            </div>}
            {quadratic.show && <div className="rs-encoded-message">
                <div className="rs-label">Quadratic solution:</div>
                <div className="encoded-message">
                    {quadratic.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <button className="btn btn-success" onClick={handleLocation}>Get location</button>
            </div>}
            {location.show && <div className="rs-encoded-message">
                <div className="rs-label">Error location:</div>
                <div className="encoded-message">
                    {location.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <button className="btn btn-success" onClick={handleForney}>Get Forney results</button>
            </div>}
            {forney.show && <div className="rs-encoded-message">
                <div className="rs-label">Forney results:</div>
                <div className="encoded-message">
                    {forney.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <button className="btn btn-success" onClick={handleError}>Get error</button>
            </div>}
            {error.show && <div className="rs-encoded-message">
                <div className="rs-label">Error:</div>
                <div className="encoded-message">
                    {error.value.map((number, numberIndex) => (
                        <NumberReader number={number} key={numberIndex} />
                    ))}
                </div>
                <button className="btn btn-success" onClick={handleSubtract}>Get original</button>
            </div>}
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