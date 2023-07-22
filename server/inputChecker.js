

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