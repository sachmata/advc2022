import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 25');

// https://adventofcode.com/2022/day/25/input

const MAP = {
    2: 2,
    1: 1,
    0: 0,
    '-': -1,
    '=': -2,
};

const RMAP = {
    2: 2,
    1: 1,
    0: 0,
    '-1': '-',
    '-2': '=',
};

function minResidue(number, base) {
    const a = number % base;
    const b = a - base;
    return Math.abs(a) < Math.abs(b) ? a : b;
}

function fromSnafu(line) {
    const digits = line.split('');
    let number = 0;
    for (let i = 0; i < digits.length; i++) {
        const factor = 5 ** (digits.length - i - 1);
        number += factor * MAP[digits[i]];
    }
    return number;
}

function toSnafu(number) {
    let result = [];

    let _number = number;
    while (_number > 0) {
        const rem = _number % 5;
        switch (rem) {
            case 0:
            case 1:
            case 2:
                result.push(RMAP[rem]);
                _number = Math.floor(_number / 5);
                break;
            case 3:
                result.push('=');
                _number = Math.floor((_number + 2) / 5);
                break;
            case 4:
                result.push('-');
                _number = Math.floor((_number + 1) / 5);
                break;
        }
    }

    return result.reverse().join('');
}

let sum = 0;

for (let line of fromFile('./day25/input.txt')) {
    if (!line.length) {
        continue;
    }

    const number = fromSnafu(line);
    // const _line = toSnafu(number);
    // console.log(line, number, _line);

    sum += number;
}

console.log(sum, toSnafu(sum)); // 29694520452605, 2=-0=01----22-0-1-10

console.log('End');
