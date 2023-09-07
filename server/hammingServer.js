import { isBinary, isHammingMessage, messageToHammingMessage, numOfParityBits } from "./inputChecker.js";
import { execFile } from 'child_process';


export const hammingIntro = (req, res) => {
    res.send("hamming intro here");
}

export const hammingInstruction = (req, res) => {
    res.send("hamming instruction here");
}

export const hammingEncode = (req, res) => {
    const { message } = req.query;
    if (!isBinary(message)) {
        res.status(400).send("message is not a binary string");
        return;
    }

    let isError = false;
    const child = execFile('./hamming_code', ['sendmessage'], (err, stdout, stderr) => {
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
        const [r, hammingMessage] = messageToHammingMessage(message);
        child.stdin.write(`${r} ${hammingMessage}`);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data));
    }
}

export const hammingDecode = (req, res) => {
    const { message } = req.query;
    if (!isHammingMessage(message)) {
        res.status(400).send("invalid encoded message");
        return;
    }

    let isError = false;
    const child = execFile('./hamming_code', ['correctmessage'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send("error executing file");
            isError = true;
            return;
        } if (stderr) {
            res.status(500).send("file executed reports error");
            isError = true;
            return;
        }
    });
    if (!isError) {
        const r = numOfParityBits(message);
        child.stdin.write(`${r} ${message}`);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data));
    }
}