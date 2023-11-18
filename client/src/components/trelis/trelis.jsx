import { useCallback, useMemo } from "react";

export default function Trelis() {
    const adders = useMemo(() => [
        [true, true, true],
        [true, false, true],
    ], []);
    const encodedMessage = useMemo(() => [true, true, true, false, false, true, false, true, true, true, true, true], []);
    const k = 6;
    const l = 3;
    const n = 2;
    const shiftRegisterStates = useMemo(() => {
        const initial = Array(l - 1).fill(false);
        const result = [initial];
        let curr = [...initial];
        for (let i = 0; i < Math.pow(2, l - 1); i++) {
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
    const [edges, vertices, corrected] = useMemo(() => {
        const vertices = [
            {
                stepIndex: 0,
                stateIndex: 0,
                errorCount: 0,
                path: [],
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
                    };
                }
            }

            lastVertices = newVertices;
            vertices.push(...newVertices);
        }

        let finalVertice = {
            errorCount: Number.MAX_SAFE_INTEGER,
            path: [],
        }
        for (let i = 0; i < lastVertices.length; i++) {
            if (finalVertice.errorCount > lastVertices[i].errorCount) {
                finalVertice.errorCount = lastVertices[i].errorCount;
                finalVertice.path = lastVertices[i].path;
            }
        }

        return [edges, vertices, finalVertice.path];
    }, [l, k, n, encodedMessage, shiftRegisterStates, shiftRegisterStateToIndex, nextBits]);

    console.log(edges);
    console.log(vertices);
    console.log(corrected);

    return <div>Hello</div>;
}
