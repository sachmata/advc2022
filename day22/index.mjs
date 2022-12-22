import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 22');

// https://adventofcode.com/2022/day/XX/input

let mapEnd = false;

const map = [];
const commands = [];

for (let line of fromFile('./day22/input.txt')) {
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

const DIRECTIONS = {
    R: 0, // right
    D: 1, // down
    L: 2, // left
    U: 3, // up
};

const MARKS = ['>', 'v', '<', '^'];

const mark = direction => MARKS[direction];

const draw = () => {
    for (let y = 0; y < map.length; y++) {
        console.log(map[y].join(''));
    }
    console.log('\n');
};

let posY = 0;
let posX = map[0].findIndex(t => t !== ' ');
let direction = 0;

console.log(posX, posY, direction);

map[posY][posX] = mark(direction);

for (const [steps, rotation] of commands) {
    console.log(steps, rotation);

    const dX = direction === 0 ? 1 : direction === 2 ? -1 : 0;
    const dY = direction === 1 ? 1 : direction === 3 ? -1 : 0;

    for (let i = 0; i < steps; i++) {
        let nextTile = map[posY + dY]?.[posX + dX] ?? ' ';

        if (nextTile === '#') {
            break;
        }

        if (nextTile === '.' || MARKS.includes(nextTile)) {
            posX += dX;
            posY += dY;

            map[posY][posX] = mark(direction);

            continue;
        }

        // out of map
        const ndX = -1 * dX;
        const ndY = -1 * dY;
        let _posX = posX;
        let _posY = posY;

        let _prevTile = map[_posY + ndY]?.[_posX + ndX] ?? ' ';
        while (_prevTile === '.' || MARKS.includes(_prevTile) || _prevTile === '#') {
            _posX += ndX;
            _posY += ndY;
            _prevTile = map[_posY + ndY]?.[_posX + ndX] ?? ' ';
        }

        nextTile = map[_posY][_posX];

        if (nextTile === '#') {
            break;
        }

        if (nextTile === '.' || MARKS.includes(nextTile)) {
            posX = _posX;
            posY = _posY;

            map[posY][posX] = mark(direction);

            continue;
        }
    }

    direction = (direction + rotation) % 4;

    map[posY][posX] = mark(direction);

    console.log(posX, posY, direction);
}

draw();

const password = 1e3 * (posY + 1) + 4 * (posX + 1) + direction;
console.log(password); // 51258 ???

console.log('End');
