import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 18');

// https://adventofcode.com/2022/day/XX/input

const key = cube => cube.join(',');

const cubes = {};

for (let line of fromFile('./day18/input.txt')) {
    if (!line.length) {
        continue;
    }

    const cube = line.split(',').map(Number);

    cubes[key(cube)] = cube;
}

const uXp = [1, 0, 0];
const uXn = [-1, 0, 0];
const uYp = [0, 1, 0];
const uYn = [0, -1, 0];
const uZp = [0, 0, 1];
const uZn = [0, 0, -1];

const UNITS = [uXp, uXn, uYp, uYn, uZp, uZn];

const add = (cube, unit) => [
    cube[0] + unit[0], //
    cube[1] + unit[1],
    cube[2] + unit[2],
];

const freeSides = Object.values(cubes).reduce((acc, cube) => {
    acc += UNITS.reduce((acc, u) => {
        const uCubeKey = key(add(cube, u));
        acc += cubes[uCubeKey] ? 0 : 1;
        return acc;
    }, 0);
    return acc;
}, 0);

console.log(freeSides); // 3610

console.log('Part two');

const bounds = Object.values(cubes).reduce(
    (acc, [x, y, z]) => {
        // expand bounds by one
        acc.minX = Math.min(acc.minX, x - 1);
        acc.maxX = Math.max(acc.maxX, x + 1);
        acc.minY = Math.min(acc.minY, y - 1);
        acc.maxY = Math.max(acc.maxY, y + 1);
        acc.minZ = Math.min(acc.minZ, z - 1);
        acc.maxZ = Math.max(acc.maxZ, z + 1);

        return acc;
    },
    {
        minX: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
        minZ: Number.POSITIVE_INFINITY,
        maxZ: Number.NEGATIVE_INFINITY,
    }
);

// console.log(bounds); // ~ [-1,-1,-1] -> [20,20,20]

const inBounds = ([x, y, z]) =>
    x >= bounds.minX &&
    x <= bounds.maxX &&
    y >= bounds.minY &&
    y <= bounds.maxY &&
    z >= bounds.minZ &&
    z <= bounds.maxZ;

// flood
const water = {};
const start = [bounds.minX, bounds.minY, bounds.minZ];
// const end = [bounds.maxX, bounds.maxY, bounds.maxZ];

water[key(start)] = start;

// BFS
const queue = [start];
while (queue.length) {
    const current = queue.shift();

    UNITS.forEach(u => {
        const uCube = add(current, u);
        const uCubeKey = key(uCube);

        if (
            inBounds(uCube) && //
            !water[uCubeKey] && // visited water cube
            !cubes[uCubeKey] // droplet cube
        ) {
            water[uCubeKey] = uCube;
            queue.push(uCube);
        }
    });
}

const wetSides = Object.values(cubes).reduce((acc, cube) => {
    acc += UNITS.reduce((acc, u) => {
        const uCubeKey = key(add(cube, u));
        acc += cubes[uCubeKey] ? 0 : water[uCubeKey] ? 1 : 0;
        return acc;
    }, 0);
    return acc;
}, 0);

console.log(wetSides); // 2082

console.log('End');
