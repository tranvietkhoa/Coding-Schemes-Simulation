

export const isBinaryString = (value) => {
    return value.split('')
        .map(char => char === '0' || char === '1')
        .reduce((prev, curr) => prev && curr, true);
}

export const isPowerOf = (num, base) => {
    while (num !== 1) {
        if (num % base !== 0) {
            return false;
        }
        num /= base;
    }
    return true;
}