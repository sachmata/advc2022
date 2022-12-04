import _ from 'lodash';

import { fromFile } from '../lib/readlines.mjs';

console.log('Day 4');

let result1 = 0;
let result2 = 0;

for (let line of fromFile('./day04/input.txt')) {
    const [a, b] = line.split(',');
    const [aFrom, aTo] = a.split('-').map(Number);
    const [bFrom, bTo] = b.split('-').map(Number);

    const aRange = _.range(aFrom, aTo + 1);
    const bRange = _.range(bFrom, bTo + 1);

    const int = _.intersection(aRange, bRange);

    if (int.length === aRange.length || int.length === bRange.length) {
        result1++;
    }

    // part two

    if (int.length > 0) {
        result2++;
    }
}

console.log('Sum part one', result1);

console.log('Part two');

console.log('Sum part two', result2);

console.log('End');
