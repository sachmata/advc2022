import { fromFile } from '../lib/read-lines.mjs';

console.log('Day XX');

// https://adventofcode.com/2022/day/XX/input

for (let line of fromFile('./dayXX/input.txt')) {
    if (!line.length) {
        continue;
    }

    console.log(line);
}

console.log('End');
