import { fromFile } from '../lib/readlines.mjs';

console.log('Day 12');

const pairs = [];
let pair = [];

for (let line of fromFile('./day13/input.txt')) {
    if (!line.length) {
        if (pair.length === 2) {
            pairs.push(pair);
            pair = [];
        }
        continue;
    }

    pair.push(JSON.parse(line));
}

function compare(left, right) {
    if (typeof left === 'number' && typeof right === 'number') {
        if (left === right) {
            return null;
        }

        return left < right;
    }

    if (Array.isArray(left) && typeof right === 'number') {
        return compare(left, [right]);
    }

    if (typeof left === 'number' && Array.isArray(right)) {
        return compare([left], right);
    }

    if (Array.isArray(left) && Array.isArray(right)) {
        for (let i = 0; i < left.length; i++) {
            if (i >= right.length) {
                return false;
            }

            const result = compare(left[i], right[i]);
            if (result !== null) {
                return result;
            }
        }

        return left.length < right.length ? true : null;
    }
}

let sum = 0;

for (let i = 0; i < pairs.length; i++) {
    const [left, right] = pairs[i];
    if (compare(left, right)) {
        sum += i + 1;
    }
}

console.log('Sum', sum);

console.log('Part two');

const packets = [];

for (let line of fromFile('./day13/input.txt')) {
    if (line.length) {
        packets.push(JSON.parse(line));
    }
}

const div1 = [[2]];
const div2 = [[6]];

packets.push(div1, div2);

packets.sort((a, b) => {
    const r = compare(b, a);
    return r === null ? 0 : r ? 1 : -1;
});

const key1 = packets.indexOf(div1) + 1;
const key2 = packets.indexOf(div2) + 1;

console.log('Key', key1 * key2);

console.log('End');
