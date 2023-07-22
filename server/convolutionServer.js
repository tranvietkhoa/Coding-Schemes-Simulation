import { execFile } from 'child_process';
import { isBinary, isInteger, isValidConvolutionalCode } from './inputChecker.js';

export const convolutionalIntro = (req, res) => {
    res.send("convolutional intro here");
}

export const convolutionalEncode = (req, res) => {
    const k = req.query.k;
    if (!isInteger(k)) {
        res.statusCode = 400;
        res.send("k is not an integer");
        return;
    }
    const n = req.query.n;
    if (!isInteger(n)) {
        res.statusCode = 400;
        res.send("n is not an integer");
        return;
    }
    const L = req.query.L;
    if (!isInteger(L)) {
        res.statusCode = 400;
        res.send("L is not an integer");
        return;
    }
    const input = req.query.input;
    if (!isBinary(input)) {
        res.statusCode = 400;
        res.send("input is not binary");
        return;
    }
    const adders = req.query.adders;
    if (typeof adders !== 'object') {
        res.statusCode = 400;
        res.send("adders is not an array");
        return;
    }
    if (adders.length !== Number(n)) {
        res.statusCode = 400;
        res.send("there must be exactly n adders");
        return;
    }
    if (!adders.map(adder => isBinary(adder)).reduce((prev, curr) => prev && curr, true)) {
        res.statusCode = 400;
        res.send("one of the adders is not binary");
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
    const k = req.query.k;
    if (!isInteger(k)) {
        res.statusCode = 400;
        res.send("k is not an integer");
        return;
    }
    const n = req.query.n;
    if (!isInteger(n)) {
        res.statusCode = 400;
        res.send("n is not an integer");
        return;
    }
    const L = req.query.L;
    if (!isInteger(L)) {
        res.statusCode = 400;
        res.send("L is not an integer");
        return;
    }
    const adders = req.query.adders;
    if (typeof adders !== 'object') {
        res.statusCode = 400;
        res.send("adders must be array");
        return;
    }
    if (adders.length !== Number(n)) {
        res.statusCode = 400;
        res.send("there must be exactly n adders");
        return;
    }
    if (!adders.map(adder => isBinary(adder)).reduce((prev, curr) => prev && curr, true)) {
        res.statusCode = 400;
        res.send("one of the adders is not binary");
        return;
    }
    const receivedCode = req.query.message;
    if (!isValidConvolutionalCode(receivedCode, k, n)) {
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
        console.log(`${k} ${n} ${L} ${adders.reduce((prev, curr) => prev + ' ' + curr, '')} ${receivedCode}`);
        child.stdin.write(`${k} ${n} ${L} ${adders.reduce((prev, curr) => prev + ' ' + curr, '')} ${receivedCode}`);
        child.stdin.end();
        child.stdout.on("data", (data) => res.send(data));
    }
}