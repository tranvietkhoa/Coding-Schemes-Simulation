import { execFile } from 'child_process'

export const convolutionalIntro = (req, res) => {
    res.send("convolutional intro here");
}

export const convolutionalEncode = (req, res) => {
    const k = Number(req.query.k);
    if (isNaN(k)) {
        res.statusCode = 400;
        res.send("k is not a number");
        return;
    }
    const n = Number(req.query.n);
    if (isNaN(n)) {
        res.statusCode = 400;
        res.send("n is not a number");
        return;
    }
    const L = Number(req.query.L);
    if (isNaN(L)) {
        res.statusCode = 400;
        res.send("L is not a number");
        return;
    }

    const input = Number(req.query.input);
    if (isNaN(input)) {
        res.statusCode = 400;
        res.send("input not a number");
        return;
    }
    const receivedAdders = req.query.adders;
    if (n > 1 && typeof receivedAdders !== 'object') {
        res.statusCode = 400;
        res.send("invalid adders");
        return;
    }
    const adders = [];
    for (let i in receivedAdders) {
        const adder = Number(receivedAdders[i]);
        if (isNaN(adder)) {
            res.statusCode = 400;
            res.send("one of the adders is not a number");
            return;
        }
        adders.push(adder);
    }

    const child = execFile('./convolutional', ['sendmessage'], (err, stdout, stderr) => {
        if (err) {
            res.send("cannot run cpp compiled executable");
            return;
        }
        if (stderr) {
            res.send("executable reporting error");
            return;
        }
    });
    child.stdin.write(`${k} ${n} ${L} ${input} ${adders.map(adder => adder.toString()).reduce((prev, curr) => prev + ' ' + curr, '')}`);
    child.stdin.end();
    child.stdout.on("data", data => res.send(data));
}