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
            commands.push([+steps, rotation === 'R' ? 1 : -1]);
        }

        continue;
    }

    const tiles = line.split('');
    map.push(tiles);
}

// const DIRECTIONS = {
//     R: 0, // right
//     D: 1, // down
//     L: 2, // left
//     U: 3, // up
// };

let posY = 0;
let posX = map[0].findIndex(t => t !== ' ');
let direction = 0;

console.log(posX, posY, direction);

for (const [steps, rotation] of commands) {
    console.log(steps, rotation);

    const dX = direction === 0 ? 1 : direction === 2 ? -1 : 0;
    const dY = direction === 1 ? 1 : direction === 3 ? -1 : 0;

    for (let i = 0; i < steps; i++) {
        let nextTile = map[posY + dY]?.[posX + dX] ?? null;

        if (nextTile === '.') {
            posX += dX;
            posY += dY;
            continue;
        }

        if (nextTile === '#') {
            break;
        }

        // out of map
        const ndX = -1 * dX;
        const ndY = -1 * dY;
        let _posX = posX;
        let _posY = posY;

        let _prevTile = map[_posY + ndY]?.[_posX + ndX] ?? null;
        while (_prevTile === '.' || _prevTile === '#') {
            _posX += ndX;
            _posY += ndY;
            _prevTile = map[_posY + ndY]?.[_posX + ndX] ?? null;
        }

        if (map[_posY][_posX] === '#') {
            break;
        }

        if (map[_posY][_posX] === '.') {
            posX = _posX;
            posY = _posY;
            continue;
        }
    }

    direction = (direction + rotation) % 4;

    console.log(posX, posY, direction);
}

const password = 1e3 * (posY + 1) + 4 * (posX + 1) + direction;
console.log(password);

console.log('End');
