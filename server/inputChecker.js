

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