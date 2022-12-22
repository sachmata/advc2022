import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 22');

// https://adventofcode.com/2022/day/XX/input

const map = [];
const commands = [];

let mapEnd = false;

for (let line of fromFile('./day22/input.txt')) {
    if (!line.length) {
        mapEnd = true;
        continue;
    }

    // commands line
    if (mapEnd) {
        const match = line.matchAll(/(\d+)(R|L)?/g);
        for (const [_, steps, rotation] of match) {
            commands.push([+steps, rotation === 'R' ? 1 : rotation === 'L' ? 3 : 0]);
        }

        continue;
    }

    const tiles = line.split('');
    map.push(tiles);
}

const DIR = { R: 0, D: 1, L: 2, U: 3 };

const MARKS = '>v<^'.split('');
const mark = direction => MARKS[direction];
const draw = () => {
    for (let y = 0; y < map.length; y++) {
        console.log(map[y].join(''));
    }
    console.log('\n');
};

const SIDE = map[0].length / 3;

const wrap = (posX, posY, dir) => {
    //   012
    // 0  12
    // 1  3
    // 2 45
    // 3 6

    const row = Math.floor(posY / SIDE);
    const col = Math.floor(posX / SIDE);

    let face;
    if (row === 0) {
        if (col === 1) {
            face = 1;
        } else if (col === 2) {
            face = 2;
        }
    } else if (row === 1) {
        if (col === 1) {
            face = 3;
        }
    } else if (row === 2) {
        if (col === 0) {
            face = 4;
        } else if (col === 1) {
            face = 5;
        }
    } else if (row === 3) {
        if (col === 0) {
            face = 6;
        }
    }

    if (!face) {
        throw new Error('? Face ?');
    }

    const sX = posX % SIDE;
    const sY = posY % SIDE;

    if (face === 1) {
        if (dir === DIR.U) {
            return [0, 3 * SIDE + sX, DIR.R]; // 1U - 6L
        } else if (dir === DIR.L) {
            return [0, 3 * SIDE - 1 - sY, DIR.R]; // 1L - 4L
        }
    } else if (face === 2) {
        if (dir === DIR.U) {
            return [sX, 4 * SIDE - 1, DIR.U]; // 2U - 6D
        } else if (dir === DIR.R) {
            return [2 * SIDE - 1, 3 * SIDE - 1 - sY, DIR.L]; // 2R - 5R
        } else if (dir === DIR.D) {
            return [2 * SIDE - 1, 1 * SIDE + sX, DIR.L]; // 2D - 3R
        }
    } else if (face === 3) {
        if (dir === DIR.L) {
            return [sY, 2 * SIDE, DIR.D]; // 3L - 4U
        } else if (dir === DIR.R) {
            return [2 * SIDE + sY, 1 * SIDE - 1, DIR.U]; // 3R - 2D
        }
    } else if (face === 4) {
        if (dir === DIR.U) {
            return [1 * SIDE, 1 * SIDE + sX, DIR.R]; // 4U - 3L
        } else if (dir === DIR.L) {
            return [1 * SIDE, 1 * SIDE - 1 - sY, DIR.R]; // 4L - 1L
        }
    } else if (face === 5) {
        if (dir === DIR.R) {
            return [3 * SIDE - 1, 1 * SIDE - 1 - sY, DIR.L]; // 5R - 2R
        } else if (dir === DIR.D) {
            return [1 * SIDE - 1, 3 * SIDE + sX, DIR.L]; // 5D - 6R
        }
    } else if (face === 6) {
        if (dir === DIR.L) {
            return [1 * SIDE + sY, 0, DIR.D]; // 6L - 1U
        } else if (dir === DIR.R) {
            return [1 * SIDE + sY, 3 * SIDE - 1, DIR.U]; // 6R - 5D
        } else if (dir === DIR.D) {
            return [2 * SIDE + sX, 0, DIR.D]; // 6D - 2U
        }
    }

    throw new Error('? Wrap ?');
};

let posY = 0;
let posX = map[0].findIndex(t => t !== ' ');
let direction = 0;

for (const [steps, rotation] of commands) {
    for (let i = 0; i < steps; i++) {
        const dX = direction === DIR.R ? 1 : direction === DIR.L ? -1 : 0;
        const dY = direction === DIR.D ? 1 : direction === DIR.U ? -1 : 0;

        let nextTile = map[posY + dY]?.[posX + dX] ?? ' ';

        if (nextTile === '#') {
            break;
        }

        if (nextTile === '.' || nextTile === 'X') {
            posX += dX;
            posY += dY;
            // map[posY][posX] = 'X';
            continue;
        }

        // out of map

        // const ndX = -1 * dX;
        // const ndY = -1 * dY;
        // let _posX = posX;
        // let _posY = posY;

        // let _prevTile = map[_posY + ndY]?.[_posX + ndX] ?? ' ';
        // while (_prevTile === '.' || MARKS.includes(_prevTile) || _prevTile === '#') {
        //     _posX += ndX;
        //     _posY += ndY;
        //     _prevTile = map[_posY + ndY]?.[_posX + ndX] ?? ' ';
        // }

        // part two
        const [_posX, _posY, _direction] = wrap(posX, posY, direction);
        nextTile = map[_posY][_posX];

        if (nextTile === '#') {
            break;
        }

        posX = _posX;
        posY = _posY;
        // map[posY][posX] = 'X';

        // part two
        direction = _direction;
    }

    direction = (direction + rotation) % 4;
}

// draw();

const password = 1e3 * (posY + 1) + 4 * (posX + 1) + direction;
console.log(password); // 26558 // 110400

console.log('End');
