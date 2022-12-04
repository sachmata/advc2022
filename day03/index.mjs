import { fromFile } from '../lib/readlines.mjs';

console.log('Day 3');

const PRIORITIES = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const result1 = [];
const result2 = [];

function partOne(a, b) {
    const _a = new Set(a.split(''));
    const _b = new Set(b.split(''));

    const int = [..._a].filter(item => _b.has(item));
    const priority = int.map(item => PRIORITIES.indexOf(item) + 1);

    result1.push([int[0], priority[0]]);
}

function partTwo(line1, line2, line3) {
    const _line1 = new Set(line1.split(''));
    const _line2 = new Set(line2.split(''));
    const _line3 = new Set(line3.split(''));

    const int = [..._line1].filter(item => _line2.has(item)).filter(item => _line3.has(item));
    const priority = int.map(item => PRIORITIES.indexOf(item) + 1);

    result2.push([int[0], priority[0]]);
}

let group = [];

for (let line of fromFile('./day03/input.txt')) {
    const a = line.substring(0, line.length / 2);
    const b = line.substring(line.length / 2);

    partOne(a, b);

    group.push(line);
    if (group.length === 3) {
        partTwo(...group);
        group = [];
    }
}

const sumPartOne = result1.reduce((acc, [_, p]) => acc + p, 0);

console.log('Sum part one', sumPartOne);

console.log('Part two');

const sumPartTwo = result2.reduce((acc, [_, p]) => acc + p, 0);

console.log('Sum part two', sumPartTwo);

console.log('End');
