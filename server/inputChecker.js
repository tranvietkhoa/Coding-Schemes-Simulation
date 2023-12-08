

export const isBinary = input => /^[0-1]*$/.test(input);

export const isInteger = input => /^[0-9]*$/.test(input);

export const isValidConvolutionalCode = (input, k, n) => {
    if (typeof input !== 'string') {
        return false;
    }
    const arr = input.split(' ');
    if (arr.length !== Number(k)) {
        return false;
    }
    return arr.map(elem => elem.length === Number(n)).reduce((prev, curr) => prev && curr, true);
}

export const isValidConvolutionalAdders = (adders, n, L) => {
    if (typeof adders !== 'object') {
        return false;
    }
    if (adders.length !== Number(n)) {
        return false;
    }
    return adders.map(adder => adder.length === Number(L) && isBinary(adder)).reduce((prev, curr) => prev && curr, true);
}

export const messageToHammingMessage = message => {
    let r = 0;
    while (Math.pow(2, r) - r - 1 < message.length) {
        r += 1;
    }
    message += '0'.repeat(Math.pow(2, r) - r - 1 - message.length);
    return [r, message];
}

export const numOfParityBits = message => {
    if (!isBinary(message)) {
        return false;
    }
    let r = 0;
    while (Math.pow(2, r) - 1 < message.length) {
        r += 1;
    }
    return r;
}

export const isHammingMessage = message => {
    const r = numOfParityBits(message);
    return Math.pow(2, r) - 1 === message.length;
}

export const isValidRS929Message = message => {
    const parts = message.split(' ');
    return parts.length === 3 
        && parts.map(part => isInteger(part) && Number(part) >= 0 && Number(part) < 929);
}

export const isValidRS929Code = code => {
    const parts = code.split(' ');
    return parts.length === 7
        && parts.map(part => isInteger(part) && Number(part) >= 0 && Number(part) < 929);
}