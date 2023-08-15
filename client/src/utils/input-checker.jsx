

export const isBinaryString = (value) => {
    return value.split('')
        .map(char => char === '0' || char === '1')
        .reduce((prev, curr) => prev && curr, true);
}