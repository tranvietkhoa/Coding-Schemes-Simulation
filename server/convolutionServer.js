import { execFile } from 'child_process';
import { isBinary, isInteger, isValidConvolutionalCode, isValidConvolutionalAdders } from './inputChecker.js';

export const convolutionalIntro = (req, res) => {
    res.send("convolutional intro here");
}

export const convolutionalInstruction = (req, res) => {
    res.send("convolutional instruction here");
}

export const convolutionalTransmit = (req, res) => {
    const { n, L, adders, currState } = req.query;
    if (!isInteger(n)) {
        res.statusCode = 400;
        res.send("n is not an integer");
        return;
    }
    if (!isInteger(L)) {
        res.statusCode = 400;
        res.send("L is not an integer");
        return;
    }
    if (!isValidConvolutionalAdders(adders, n, L)) {
        res.statusCode = 400;
        res.send("invalid adders");
        return;
    }
    if (!isBinary(currState) && currState.length === Number(L)) {
        res.statusCode = 400;
        res.send("invalid current state");
        return;
    }

    let isError = false;
    const child = execFile('./convolutional', ['nextoutput'], (err, stdout, stderr) => {
        if (err) {
            res.statusCode = 500;
            res.send("error executing file");
            isError = true;
            return;
        }
        if (stderr) {
            res.statusCode = 500;
            res.send("file executed reports error");
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
        res.statusCode = 400;
        res.send("k is not an integer");
        return;
    }
    if (!isInteger(n)) {
        res.statusCode = 400;
        res.send("n is not an integer");
        return;
    }
    if (!isInteger(L)) {
        res.statusCode = 400;
        res.send("L is not an integer");
        return;
    }
    if (!isBinary(input)) {
        res.statusCode = 400;
        res.send("input is not binary");
        return;
    }
    if (!isValidConvolutionalAdders(adders, n, L)) {
        res.statusCode = 400;
        res.send("invalid adders");
        return;
    }

    let isError = false;
    const child = execFile('./convolutional', ['sendmessage'], (err, stdout, stderr) => {
        if (err) {
            res.statusCode = 500;
            res.send("cannot run cpp compiled executable");
            isError = true;
            return;
        }
        if (stderr) {
            res.statusCode = 500;
            res.send("executable reporting error");
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
        res.statusCode = 400;
        res.send("k is not an integer");
        return;
    }
    if (!isInteger(n)) {
        res.statusCode = 400;
        res.send("n is not an integer");
        return;
    }
    if (!isInteger(L)) {
        res.statusCode = 400;
        res.send("L is not an integer");
        return;
    }
    if (!isValidConvolutionalAdders(adders, n, L)) {
        res.statusCode = 400;
        res.send("invalid adders");
        return;
    }
    if (!isValidConvolutionalCode(message, k, n)) {
        res.statusCode = 400;
        res.send("invalid convolutional code");
        return;
    }

    let isError = false;
    const child = execFile('./convolutional', ['correctmessage'], (err, stdout, stderr) => {
        if (err) {
            res.statusCode = 500;
            res.send("cannot run cpp compiled executable");
            isError = true;
            return;
        }
        if (stderr) {
            res.statusCode = 500;
            res.send("executable reporting error");
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