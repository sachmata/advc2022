import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 14');

const paths = [];

for (let line of fromFile('./day14/input.txt')) {
    if (!line.length) {
        continue;
    }

    paths.push(line.split(' -> ').map(l => l.split(',').map(Number)));
}

const map = [];

let maxX = 0;
let maxY = 0;

for (let path of paths) {
    for (let i = 1; i < path.length; i++) {
        const [aX, aY] = path[i - 1];
        const [bX, bY] = path[i];

        const fromX = Math.min(aX, bX);
        const toX = Math.max(aX, bX);
        const fromY = Math.min(aY, bY);
        const toY = Math.max(aY, bY);

        if (maxX < toX) {
            maxX = toX;
        }
        if (maxY < toY) {
            maxY = toY;
        }

        for (let y = fromY; y <= toY; y++) {
            map[y] ??= [];

            for (let x = fromX; x <= toX; x++) {
                map[y][x] = '#';
            }
        }
    }
}

// add floor -- part two
const floorY = maxY + 2;

function draw(map) {
    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        if (!row) {
            console.log('...');
            continue;
        }

        let line = '';
        for (let x = 300; x < row.length; x++) {
            line += row[x] ?? ' ';
        }
        console.log(line);
    }
}

// draw(map);

function step([sandX, sandY], map) {
    const down = [sandX, sandY + 1];
    const downLeft = [sandX - 1, sandY + 1];
    const downRight = [sandX + 1, sandY + 1];

    if (down[1] >= floorY) {
        // reached the floor -- part two
        return null;
    }

    if (!map[down[1]]?.[down[0]]) {
        return down;
    }
    if (!map[downLeft[1]]?.[downLeft[0]]) {
        return downLeft;
    }
    if (!map[downRight[1]]?.[downRight[0]]) {
        return downRight;
    }

    return null;
}

const EMITTER = [500, 0];

function simulation1() {
    const _map = map.map(l => [...l]); // clone map

    let counter = 0;
    let keepComing = true;

    while (keepComing) {
        let sand = EMITTER;
        counter++;

        while (true) {
            const _sand = step(sand, _map);
            if (!_sand) {
                // stopped
                break;
            }

            if (sand[1] >= maxY) {
                // fall off -- part one
                keepComing = false;
                break;
            }

            sand = _sand;
        }

        _map[sand[1]] ??= [];
        _map[sand[1]][sand[0]] = 'o';
    }

    // draw(_map);

    return counter - 1;
}

function simulation2() {
    const _map = map.map(l => [...l]); // clone map

    let counter = 0;
    let keepComing = true;

    while (keepComing) {
        let sand = EMITTER;
        counter++;

        let steps = 0;
        while (true) {
            const _sand = step(sand, _map);
            if (!_sand) {
                // stopped
                if (!steps) {
                    // fill up -- part two
                    keepComing = false;
                }

                break;
            }

            steps++;

            sand = _sand;
        }

        _map[sand[1]] ??= [];
        _map[sand[1]][sand[0]] = 'o';
    }

    // draw(_map);

    return counter;
}

const counter1 = simulation1();
console.log(counter1); // 897

console.log('Part two');

const counter2 = simulation2();
console.log(counter2); // 26683

console.log('End');
