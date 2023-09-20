import { isValidRS929Code, isValidRS929Message } from "./inputChecker.js";
import { execFile } from 'child_process';


export const reedSolomonIntro = (req, res) => {
    res.send("reed solomon intro here");
}

export const reedSolomonEncode = (req, res) => {
    const { message } = req.query;
    if (typeof message !== 'string' || !isValidRS929Message(message)) {
        res.status(400).send("invalid message");
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['encode'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
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
        child.stdin.write(message);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}

export const reedSolomonEncodeMultiply = (req, res) => {
    const { message } = req.query;
    if (typeof message !== 'string' || !isValidRS929Message(message)) {
        res.status(400).send('invalid message');
        return;
    }
    
    let isError = false;
    const child = execFile('./RC_929', ['encode-multiply'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
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
        child.stdin.write(message);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}

export const reedSolomonEncodeRemainder = (req, res) => {
    const { message } = req.query;
    if (typeof message !== 'string' || !isValidRS929Code(message)) {
        res.status(400).send("invalid message");
        return;
    }
    
    let isError = false;
    const child = execFile('./RC_929', ['encode-remainder'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
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
        child.stdin.write(message);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}