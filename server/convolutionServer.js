import { execFile } from 'child_process';
import { isBinary, isInteger, isValidConvolutionalCode, isValidConvolutionalAdders } from './inputChecker.js';

const convolutionalIntroData = [
    {
        header: "Introduction",
        body: [
            {
                text: "Convolutional code works based on a shift register. Each input is inserted to the left of the shift register, and the bits on the register shift to the right, creating a set of new encoded bits. These new bits are added to the encoded message. The process repeats, until the input stream is exhausted, creating the complete encoded message."
            },
        ]
    },
    {
        header: "What is shift register?",
        body: [
            {
                text: "A shift register is an array of buckets, each containing a bit. There are readouts, each of which read some bits on the register, and perform XOR operation on the bits obtained to output one single bits."
            },
            {
                text: "After the readouts read the bits on the shift register, the bits on the shift register shifts to the right. As a result, one bit on the right is discarded, and there is one empty bucket on the left. This empty bucket is supplemented by the input stream. Consequently, the bits on the shift register change, and new bits are produced from the readouts. The cycle repeats until the input stream is exhausted."
            },
        ]
    },
    {
        header: "Shift register and convolutional code",
        body: [
            {
                text: "Convolutional code works based on a shift register. The original message is treated as the input stream. A shift register and some readouts are used to transform the input stream, producing the encoded message."
            },
            {
                text: "The received message may receive error."
            },
        ]
    }
]

export const convolutionalIntro = (req, res) => {
    res.send(JSON.stringify(convolutionalIntroData));
}

export const convolutionalInstruction = (req, res) => {
    res.send("convolutional instruction here");
}

export const convolutionalTransmit = (req, res) => {
    const { n, L, adders, currState } = req.query;
    if (!isInteger(n)) {
        res.status(400).send("n is not an integer");
        return;
    }
    if (!isInteger(L)) {
        res.status(400).send("L is not an integer");
        return;
    }
    if (!isValidConvolutionalAdders(adders, n, L)) {
        res.status(400).send("invalid adders");
        return;
    }
    if (!isBinary(currState) && currState.length === Number(L)) {
        res.status(400).send("invalid current state");
        return;
    }

    let isError = false;
    const child = execFile('./convolutional', ['nextoutput'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send("error executing file");
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send("file executed reports error");
            isError = true;
            return;
        }
    });

    if (!isError) {
        child.stdin.write(`${n} ${L} ${adders.reduce((prev, curr) => prev + ' ' + curr, '')} ${currState}`);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data));
    }
}

export const convolutionalEncode = (req, res) => {
    const { k, n, L, input, adders } = req.query;
    if (!isInteger(k)) {
        res.status(400).send("k is not an integer");
        return;
    }
    if (!isInteger(n)) {
        res.status(400).send("n is not an integer");
        return;
    }
    if (!isInteger(L)) {
        res.status(400).send("L is not an integer");
        return;
    }
    if (!isBinary(input)) {
        res.status(400).send("input is not binary");
        return;
    }
    if (!isValidConvolutionalAdders(adders, n, L)) {
        res.status(400).send("invalid adders");
        return;
    }

    let isError = false;
    const child = execFile('./convolutional', ['sendmessage'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send("cannot run cpp compiled executable");
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send("executable reporting error");
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(`${k} ${n} ${L} ${input} ${adders.reduce((prev, curr) => prev + ' ' + curr, '')}`);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data));
    }
}

export const convolutionalDecode = (req, res) => {
    const { k, n, L, adders, message } = req.query;
    if (!isInteger(k)) {
        res.status(400).send("k is not an integer");
        return;
    }
    if (!isInteger(n)) {
        res.status(400).send("n is not an integer");
        return;
    }
    if (!isInteger(L)) {
        res.status(400).send("L is not an integer");
        return;
    }
    if (!isValidConvolutionalAdders(adders, n, L)) {
        res.status(400).send("invalid adders");
        return;
    }
    if (!isValidConvolutionalCode(message, k, n)) {
        res.status(400).send("invalid convolutional code");
        return;
    }

    let isError = false;
    const child = execFile('./convolutional', ['correctmessage'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send("cannot run cpp compiled executable");
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send("executable reporting error");
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(`${k} ${n} ${L} ${adders.reduce((prev, curr) => prev + ' ' + curr, '')} ${message}`);
        child.stdin.end();
        child.stdout.on("data", (data) => res.send(data));
    }
}