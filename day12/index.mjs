import { fromFile } from '../lib/readlines.mjs';

console.log('Day 12');

const terrain = [];
let start;
let target;

for (let line of fromFile('./day12/input.txt')) {
    if (!line.length) {
        continue;
    }

    terrain.push(
        line.split('').map((elv, x) => {
            const y = terrain.length;
            if (elv === 'S') {
                elv = 'a';
                start = { x, y };
            }

            if (elv === 'E') {
                elv = 'z';
                target = { x, y };
            }

            return { elv, x, y };
        })
    );
}

function BFS(start, end) {
    const _terrain = terrain.map(l => l.map(p => ({ ...p }))); // copy

    const _start = _terrain[start.y]?.[start.x];
    _start.visited = true;
    _start.distance = 0;

    const _end = _terrain[end.y]?.[end.x];

    const queue = [_start];

    while (!_end.distance && queue.length) {
        const current = queue.shift();

        for (let [x, y] of [
            [current.x, current.y - 1], // 'N'
            [current.x + 1, current.y], // 'E'
            [current.x, current.y + 1], // 'S'
            [current.x - 1, current.y], // 'W'
        ]) {
            const next = _terrain[y]?.[x];
            if (!next) {
                continue; // don`t go off terrain
            }

            const diff = next.elv.charCodeAt(0) - current.elv.charCodeAt(0);
            if (diff > 1) {
                continue; // to high
            }

            if (next.visited) {
                continue;
            }
            next.visited = true;
            next.distance = current.distance + 1;

            queue.push(next);
        }
    }

    return _end.distance;
}

if (!start || !target) {
    throw new Error('no data');
}

const distance = BFS(start, target);
console.log({ ...start, distance });

console.log('Part two');

const results = [];

for (let y = 0; y < terrain.length; y++) {
    for (let x = 0; x < terrain[y].length; x++) {
        if (terrain[y][x].elv === 'a') {
            const distance = BFS({ x, y }, target);
            if (distance) {
                results.push({ x, y, distance });
            }
        }
    }
}

const result = results.sort((a, b) => a.distance - b.distance)[0];
console.log(result);

console.log('End');
