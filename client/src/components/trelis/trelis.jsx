/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback, useMemo, useReducer } from "react";
import BinaryInput from '../numberinput/BinaryInput';

export default function Trelis({ k, l, n, adders, originalEncodedMessage }) {
    const [encodedMessage, dispatchEncodedMessage] = useReducer((state, action) => {
        return state.map((bit, i) => i === action.index ? !bit : bit);
    }, originalEncodedMessage);
    const groupedEncodedMessage = useMemo(() => {
        const result = []
        for (let i = 0; i < k * n; i += n) {
            const group = [];
            for (let j = 0; j < n; j++) {
                group.push(encodedMessage[i + j]);
            }
            result.push(group);
        }
        return result;
    }, [encodedMessage, k, n]);
    const shiftRegisterStates = useMemo(() => {
        const initial = Array(l - 1).fill(false);
        const result = [initial];
        let curr = [...initial];
        for (let i = 0; i < Math.pow(2, l - 1) - 1; i++) {
            let j = 0;
            while (curr[j]) {
                curr[j] = false;
                j++;
            }
            curr[j] = true;
            result.push(curr);
            curr = [...curr];
        }
        return result;
    }, [l]);
    const nextBits = useCallback((bit, shiftRegisterState) => {
        const state = [bit, ...shiftRegisterState];
        return adders.map((adder) => {
            let result = 0;
            for (let i = 0; i < adder.length; i++) {
                result ^= (adder[i] & state[i]);
            }
            return result;
        });
    }, [adders]);
    const shiftRegisterStateToIndex = useCallback((shiftRegisterState) => {
        let result = 0;
        for (let i = l - 2; i >= 0; i--) {
            if (shiftRegisterState[i]) {
                result += Math.pow(2, i);
            }
        }
        return result;
    }, [l]);
    const [edges, vertices, corrected, origin] = useMemo(() => {
        const vertices = [
            {
                stepIndex: 0,
                stateIndex: 0,
                errorCount: 0,
                path: [],
                origin: [],
                register: Array(l - 1).fill(false),
            },
        ];
        const edges = [];

        let lastVertices = vertices;
        for (let index = 1; index <= k; index++) {
            const newVertices = [...Array(Math.pow(2, Math.min(index, l - 1))).keys()].map(i => ({
                stepIndex: index,
                stateIndex: i,
                errorCount: Number.MAX_SAFE_INTEGER,
                path: [],
                origin: [],
                register: shiftRegisterStates[i],
            }));
            for (let j = 0; j < lastVertices.length; j++) {
                const newZeroRegister = [0, ...lastVertices[j].register.slice(0, -1)];
                const zeroIndex = shiftRegisterStateToIndex(newZeroRegister);
                const zeroNextBits = nextBits(0, lastVertices[j].register);
                edges.push({
                    bitAdded: 0,
                    from: {
                        stepIndex: index - 1,
                        stateIndex: j,
                    },
                    to: {
                        stepIndex: index,
                        stateIndex: zeroIndex,
                    },
                    bits: zeroNextBits,
                });
                const newZeroErrCount = encodedMessage.slice(n * (index - 1), n * index)
                    .map((bit, i) => bit ^ zeroNextBits[i])
                    .reduce((x, y) => x + (y ? 1 : 0));
                if (newVertices[zeroIndex].errorCount > lastVertices[j].errorCount + newZeroErrCount) {
                    newVertices[zeroIndex] = {
                        ...newVertices[zeroIndex],
                        errorCount: lastVertices[j].errorCount + newZeroErrCount,
                        path: lastVertices[j].path.concat(zeroNextBits),
                        origin: [...lastVertices[j].origin, 0],
                    };
                }

                const newOneRegister = [1, ...lastVertices[j].register.slice(0, -1)];
                const oneIndex = shiftRegisterStateToIndex(newOneRegister);
                const oneNextBits = nextBits(1, lastVertices[j].register);
                edges.push({
                    bitAdded: 1,
                    from: {
                        stepIndex: index - 1,
                        stateIndex: j,
                    },
                    to: {
                        stepIndex: index,
                        stateIndex: oneIndex,
                    },
                    bits: oneNextBits,
                });
                const newOneErrCount = encodedMessage.slice(n * (index - 1), n * index)
                    .map((bit, i) => bit ^ oneNextBits[i])
                    .reduce((x, y) => x + (y ? 1 : 0));
                if (newVertices[oneIndex].errorCount > lastVertices[j].errorCount + newOneErrCount) {
                    newVertices[oneIndex] = {
                        ...newVertices[oneIndex],
                        errorCount: lastVertices[j].errorCount + newOneErrCount,
                        path: lastVertices[j].path.concat(oneNextBits),
                        origin: [...lastVertices[j].origin, 1],
                    };
                }
            }

            lastVertices = newVertices;
            vertices.push(...newVertices);
        }

        let finalVertice = {
            errorCount: Number.MAX_SAFE_INTEGER,
            path: [],
            origin: [],
        }
        for (let i = 0; i < lastVertices.length; i++) {
            if (finalVertice.errorCount > lastVertices[i].errorCount) {
                finalVertice.errorCount = lastVertices[i].errorCount;
                finalVertice.path = lastVertices[i].path;
                finalVertice.origin = lastVertices[i].origin.toReversed();
            }
        }

        return [edges, vertices, finalVertice.path, finalVertice.origin];
    }, [l, k, n, encodedMessage, shiftRegisterStates, shiftRegisterStateToIndex, nextBits]);

    const groupedCorrected = useMemo(() => {
        const result = [];
        for (let i = 0; i < corrected.length / n; i++) {
            const newGroup = [];
            for (let j = 0; j < n; j++) {
                newGroup.push(corrected[i * n + j]);
            }
            result.push(newGroup);
        }
        return result;
    }, [corrected, n]);

    return <div css={trelisCss}>
        <div css={messagesCss}>
            <div css={messageCss}>
                {groupedEncodedMessage.map((group, i) => (
                    <div key={i} css={groupCss(i)}>
                        {group.map((bit, j) => (
                            <BinaryInput 
                                isOn={bit}
                                dispatchIsOn={() => dispatchEncodedMessage({
                                    index: i * n + j
                                })}
                                key={j}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div css={messageCss}>
                {groupedCorrected.map((group, i) => (
                    <div key={i} css={groupCss(i)}>
                        {group.map((bit, j) => (
                            <BinaryInput
                                isOn={bit}
                                key={j}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
        <div css={trelisMapCss}>
            {vertices.map((vertice, i) => <Vertice info={vertice} key={i} />)}
            {edges.map((edge, i) => <Edge edge={edge} key={i} />)}
            {shiftRegisterStates.map((state) => state.map(state => state ? "1" : "0").reduce((x, y) => x + y)).map((state, i) => (
                <div key={i} css={stateCss(i)}>{state}</div>
            ))}
        </div>
        <div css={originalMessageDivCss}>
            <div>Original message:</div>
            <div css={originalMessageCss}>
                {origin.map((bit, i) => <BinaryInput isOn={bit} key={i} />)}
            </div>
        </div>
        <div css={addersCss}>
            <div>Adders:</div>
            <div css={adderGroupCss}>
                {adders.map((adder, i) => (
                    <div css={adderCss} key={i}>
                        {adder.map((bit, j) => (
                            <BinaryInput 
                                key={j}
                                isOn={bit}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>;
}

const trelisCss = css`
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    min-width: 800px;
`;

const trelisMapCss = css`
    position: relative;
    height: 370px;
    width: 600px;
`;

const messagesCss = css`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const messageCss = css`
    height: 40px;
    position: relative;
`;

const groupCss = (index) => css`
    position: absolute;
    left: ${100 * index + 50}px;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
`;

const stateCss = (index) => css`
    position: absolute;
    top: ${index * 100}px;
    left: -50px;
`;

const Vertice = ({ info }) => {
    return <div css={verticeCss(info.stateIndex, info.stepIndex)}>
        <span css={verticePointCss} />
        <div css={verticeAnnotationCss}>{info.errorCount}</div>
    </div>;
};

const verticeCss = (stateIndex, stepIndex) => css`
    position: absolute;
    left: ${stepIndex * 100}px;
    top: ${stateIndex * 100 + 10}px;
`;

const verticePointCss = css`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    background-color: black;
`;

const verticeAnnotationCss = css`
    position: absolute;
    top: 20px;
    transform: translateX(-50%);
`;

const originalMessageDivCss = css`
    display: flex;
    flex-direction: row;
    gap: 15px;
    align-items: center;
`;

const originalMessageCss = css`
    display: flex;
    flex-direction: row;
`;

const addersCss = css`
    position: absolute;
    right: 0px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const adderGroupCss = css`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const adderCss = css`
    display: flex;
    flex-direction: row;
`;

const Edge = ({ edge }) => {
    const length = 100 * Math.sqrt(1 + Math.pow(edge.from.stateIndex - edge.to.stateIndex, 2));
    const rotation = 180 / Math.PI * Math.atan(edge.to.stateIndex - edge.from.stateIndex);

    return <div css={edgeCss(edge.from.stateIndex, edge.from.stepIndex)}>
        <div css={edgeBitsCss(rotation)}>{edge.bits}</div>
        <svg
            height={2}
            width={length + 2}
            css={edgeSvgCss(rotation)}
        >
            <line x1={1} x2={length} y1={1} y2={1} css={edgeLineCss} />
        </svg>
    </div>
};

const edgeCss = (startStateIndex, startStepIndex) => css`
    position: absolute;
    top: ${100 * startStateIndex + 10}px;
    left: ${100 * startStepIndex}px;
`;

const edgeSvgCss = (angle) => css`
    position: absolute;
    transform-origin: 0px 0px;
    rotate: ${angle}deg;
`;

const edgeLineCss = css`
    stroke: black;
    stroke-width: 1px;
    stroke-linecap: round;
`;

const edgeBitsCss = (angle) => css`
    position: absolute;
    top: ${Math.sin(angle * Math.PI / 180) * 30 - 10}px;
    left: ${Math.cos(angle * Math.PI / 180) * 30}px;
`;
