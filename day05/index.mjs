import _ from 'lodash';

import { fromFile } from '../lib/readlines.mjs';

console.log('Day 5');

const stacks = [];
const commands = [];

let stacksDef = true;

for (let line of fromFile('./day05/input.txt')) {
    if (!line || line.startsWith(' 1   2   3')) {
        stacksDef = false;
        continue;
    }

    if (stacksDef) {
        // stacks
        for (let m of line.matchAll(/(\[(?<crate>[A-Z])\]|\s{3})\s?/g)) {
            const crate = m.groups.crate;
            if (crate) {
                const row = m.index / 4;
                stacks[row] = (stacks[row] || '') + crate;
            }
        }

        continue;
    }

    // commands
    const [_, count, from, to] = line.match(/^move (\d+) from (\d+) to (\d+)$/);
    commands.push([+count, +from - 1, +to - 1]);
}

// console.log('Stacks', stacks);
// console.log('Commands', commands);

const stacks1 = [...stacks];
// console.log(stacks1);
for (const [count, from, to] of commands) {
    let i = count;
    while (i--) {
        const get = stacks1[from].substr(0, 1);
        stacks1[from] = stacks1[from].substr(1);
        stacks1[to] = get + stacks1[to];
    }

    // console.log(count, from, to, stacks1);
}

let result1 = '';
for (const stack of stacks1) {
    result1 += stack[0];
}

console.log('Result', result1);

console.log('Part two');

const stacks2 = [...stacks];
// console.log(stacks2);
for (const [count, from, to] of commands) {
    const get = stacks2[from].substr(0, count);
    stacks2[from] = stacks2[from].substr(count);
    stacks2[to] = get + stacks2[to];

    // console.log(count, from, to, stacks2);
}

let result2 = '';
for (const stack of stacks2) {
    result2 += stack[0];
}

console.log('Result', result2);

console.log('End');
