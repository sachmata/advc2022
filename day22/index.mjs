import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 22');

// https://adventofcode.com/2022/day/XX/input

let mapEnd = false;

const map = [];
const commands = [];

for (let line of fromFile('./day22/example.txt')) {
    if (!line.length) {
        mapEnd = true;
        continue;
    }

    if (mapEnd) {
        // commands line

        const match = line.matchAll(/(\d+)(R|L)/g);
        for (const [_, steps, rotation] of match) {
            commands.push([+steps, rotation]);
        }

        continue;
    }

    const tiles = line.split('');
    map.push(tiles);
}

let posY = 0;
let posX = map[0].findIndex(t => t !== ' ');

console.log(posX);

console.log('End');
