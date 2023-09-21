import { isValidRS929Code, isValidRS929ErrorLocator, isValidRS929Message, isValidRS929Syndrome } from "./inputChecker.js";
import { execFile } from 'child_process';


export const reedSolomonIntro = (req, res) => {
    res.send("reed solomon intro here");
}

export const reedSolomonInstruction = (req, res) => {
    res.send("RS instruction here");
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

export const reedSolomonDecode = (req, res) => {
    const { encoded } = req.query;
    if (typeof encoded !== 'string' || !isValidRS929Code(encoded)) {
        res.status(400).send('invalid encoded message');
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['decode'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(encoded);
        child.stdin.end();
        child.stdout.on("data", data => res.send(
            data.split('\n').map(str => str.trim()).reduce((prev, curr) => prev + '\n' + curr)
        ));
    }
}

export const reedSolomonSyndrome = (req, res) => {
    const { encoded } = req.query;
    if (typeof encoded !== 'string' || !isValidRS929Code(encoded)) {
        res.status(400).send('invalid encoded message');
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['syndrome'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(encoded);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}

export const reedSolomonLocator = (req, res) => {
    const { syndrome } = req.query;
    if (typeof syndrome !== 'string' || !isValidRS929Syndrome(syndrome)) {
        res.status(400).send('invalid syndrome');
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['locator'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(syndrome);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()))
    }
}

export const reedSolomonQuadratic = (req, res) => {
    const { locator } = req.query;
    if (typeof locator !== 'string' || !isValidRS929ErrorLocator(locator)) {
        res.status(400).send("invalid error locator");
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['quadratic'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(locator);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}

export const reedSolomonLocation = (req, res) => {
    const { quad } = req.query;
    if (typeof quad !== 'string' || !isValidRS929ErrorLocator(quad)) {
        res.status(400).send("invalid quadratic solutions");
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['location'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(quad);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}

export const reedSolomonForney = (req, res) => {
    const { quad } = req.query;
    if (typeof quad !== 'string' || !isValidRS929ErrorLocator(quad)) {
        res.status(400).send("invalid quadratic solutions");
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['forney'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(quad);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}

export const reedSolomonError = (req, res) => {
    const { forney, location } = req.query;
    if (typeof forney !== 'string' || !isValidRS929ErrorLocator(forney)) {
        res.status(400).send("invalid forney solution");
        return;
    }
    if (typeof location !== 'string' || !isValidRS929ErrorLocator(location)) {
        res.status(400).send("invalid location");
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['error'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(location + ' ' + forney);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}

export const reedSolomonSubtract = (req, res) => {
    const { received, error } = req.query;
    if (typeof received !== 'string' || !isValidRS929Code(received)) {
        res.status(400).send("invalid encoded message");
        return;
    }
    if (typeof error !== 'string' || !isValidRS929Code(error)) {
        res.status(400).send("invalid error");
        return;
    }

    let isError = false;
    const child = execFile('./RC_929', ['subtract'], (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('cannot run cpp compiled executable');
            isError = true;
            return;
        }
        if (stderr) {
            res.status(500).send('executable reporting error');
            isError = true;
            return;
        }
    });
    if (!isError) {
        child.stdin.write(received + ' ' + error);
        child.stdin.end();
        child.stdout.on("data", data => res.send(data.trim()));
    }
}