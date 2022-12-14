import _ from 'lodash';

import { fromFile } from '../lib/readlines.mjs';

console.log('Day 9');

const commands = [];

for (let line of fromFile('./day09/input.txt')) {
    const direction = line[0];
    const steps = +line.substr(1);
    commands.push([direction, steps]);
}

function step(direction, knots, visited) {
    const sx = direction === 'R' ? 1 : direction === 'L' ? -1 : 0;
    const sy = direction === 'U' ? 1 : direction === 'D' ? -1 : 0;

    knots[0] = [knots[0][0] + sx, knots[0][1] + sy]; // head

    for (let tail = 1; tail < knots.length; tail++) {
        const dx = knots[tail - 1][0] - knots[tail][0];
        const dy = knots[tail - 1][1] - knots[tail][1];

        const touching = Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
        if (!touching) {
            const mx = dx !== 0 ? Math.abs(dx) / dx : 0;
            const my = dy !== 0 ? Math.abs(dy) / dy : 0;

            knots[tail] = [knots[tail][0] + mx, knots[tail][1] + my];
        }
    }

    visited.add(JSON.stringify(knots[knots.length - 1]));
}

const xBounds = [-20, 20]; // [-300, 300]
const yBounds = [-10, 10]; // [-200, 200]

function getBounds(points) {
    const xs = points.map(k => k[0]);
    const ys = points.map(k => k[1]);

    const xMin = Math.min(...xs, ...xBounds);
    const xMax = Math.max(...xs, ...xBounds);

    const yMin = Math.min(...ys, ...yBounds);
    const yMax = Math.max(...ys, ...yBounds);

    return { xMin, xMax, yMin, yMax };
}

function drawRope(knots) {
    const { xMin, xMax, yMin, yMax } = getBounds(knots);

    for (let y = yMax; y >= yMin; y--) {
        let line = '';
        for (let x = xMin; x <= xMax; x++) {
            const index =
                knots
                    .map((k, i) => (k[0] === x && k[1] === y ? i : null))
                    .filter(i => i !== null)?.[0] ?? null;

            line += index > 0 ? index : index === 0 ? 'H' : (x === 0) & (y === 0) ? 's' : '.';
        }
        console.log(line);
    }

    console.log('');
}

function drawVisited(visited) {
    const { xMin, xMax, yMin, yMax } = getBounds([...visited].map(s => JSON.parse(s)));

    for (let y = yMax; y >= yMin; y--) {
        let line = '';
        for (let x = xMin; x <= xMax; x++) {
            line += (x === 0) & (y === 0) ? 's' : visited.has(JSON.stringify([x, y])) ? '#' : '.';
        }
        console.log(line);
    }

    console.log('');
}

const knots1 = [
    [0, 0], // head
    [0, 0], // tail
];
const visited1 = new Set([JSON.stringify([0, 0])]);

for (let command of commands) {
    // console.log('');
    // console.log('== ', command, ' ==');

    for (let i = 0; i < command[1]; i++) {
        step(command[0], knots1, visited1);
        // drawRope(knots1);
    }
}

// drawRope(knots1);
// drawVisited(visited1);

console.log('Visited', visited1.size); // 6090

console.log('Part two');

const knots2 = [
    [0, 0], // head
    [0, 0], // 1
    [0, 0], // 2
    [0, 0], // 3
    [0, 0], // 4
    [0, 0], // 5
    [0, 0], // 6
    [0, 0], // 7
    [0, 0], // 8
    [0, 0], // tail
];
const visited2 = new Set([JSON.stringify([0, 0])]);

for (let command of commands) {
    // console.log('');
    // console.log('== ', command, ' ==');

    for (let i = 0; i < command[1]; i++) {
        step(command[0], knots2, visited2);
        // drawRope(knots2);
    }
}

// drawRope(knots2);
// drawVisited(visited2);

console.log('Visited', visited2.size); // 2566

console.log('End');
