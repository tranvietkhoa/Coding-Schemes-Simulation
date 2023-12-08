import { execFile } from 'child_process';
import { isBinary, isInteger, isValidConvolutionalCode, isValidConvolutionalAdders } from './inputChecker.js';

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
        child.stdout.on("data", (data) => {
            const fragments = data.split(' ');
            res.send({
                original: fragments[fragments.length - 1].trim(),
                corrected: fragments.slice(0, fragments.length - 1).reduce((prev, curr) => prev + curr),
            })
        });
    }
}