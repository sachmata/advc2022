import { fromFile } from '../lib/read-lines.mjs';
import cyrb53 from '../lib/cyrb53.mjs';
import Cache from '../lib/cache.mjs';

console.log('Day 24');

// https://adventofcode.com/2022/day/24/input

const DIR = '^>v<';
const OFFSETS = [
    [0, -1], // up
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
];

const key = (x, y) => [x, y].join('|');

const data = new Map();

const minX = 1;
const minY = 1;
let maxX = 0;
let maxY = 0;

let y = -1;
for (let line of fromFile('./day24/input.txt')) {
    y++;

    if (!line.length) {
        continue;
    }

    let x = -1;
    for (const r of line.split('')) {
        x++;

        const dir = DIR.indexOf(r);
        if (dir !== -1) {
            const bzrd = [x, y, dir];
            data.set(key(...bzrd), [bzrd]);
        }
    }
    maxX = x - 1;
}
maxY = y - 1;

const draw = bzrds => {
    for (let y = 1; y <= maxY; y++) {
        let line = '';
        for (let x = 1; x <= maxX; x++) {
            const _key = key(x, y);
            if (bzrds.has(_key)) {
                const stack = bzrds.get(_key);
                if (stack.length > 1) {
                    line += String(stack.length);
                } else {
                    line += DIR[stack[0][2]];
                }
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
    console.log();
};

const step = bzrds => {
    const _bzrds = new Map();

    for (const stack of bzrds.values()) {
        for (const [x, y, d] of stack) {
            const [_x, _y] = OFFSETS[d];
            const _bzrd = [x + _x, y + _y, d];
            if (_bzrd[0] > maxX) _bzrd[0] = minX;
            if (_bzrd[0] < minX) _bzrd[0] = maxX;
            if (_bzrd[1] > maxY) _bzrd[1] = minY;
            if (_bzrd[1] < minY) _bzrd[1] = maxY;

            const _key = key(..._bzrd);
            if (_bzrds.has(_key)) {
                _bzrds.get(_key).push(_bzrd);
            } else {
                _bzrds.set(_key, [_bzrd]);
            }
        }
    }

    return _bzrds;
};

const blizzardsStateCache = [data];
const blizzardsState = time => {
    const cached = blizzardsStateCache[time];
    if (cached) return cached;

    const state = step(blizzardsState(time - 1));
    blizzardsStateCache[time] = state;
    return state;
};

// console.log(blizzards, maxX, maxY);

const MAX_TIME = 300;

const cache = new Cache();

const dfs = (x, y, time, start, end) => {
    if (time > MAX_TIME) {
        return MAX_TIME;
    }

    if (x === maxX && y === maxY) {
        // console.log('end', x, y, time + 1);
        return time + 1;
    }

    const cacheKey = cyrb53([x, y, time].join('|'));
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const _time = time + 1;
    const _data = blizzardsState(_time);

    const min = Math.min(
        ...[...OFFSETS, [0, 0]].map(([oX, oY]) => {
            const _x = x + oX;
            const _y = y + oY;

            if (_x === minX && minY - 1 === 0) {
                // wait on start;
                return dfs(_x, _y, _time);
            }

            // if (_x === maxX && y === maxY + 1) {
            //     // wait on start;
            //     return dfs(_x, _y, _time);
            // }

            if (_x < minX || _x > maxX || _y < minY || _y > maxY || _data.has(key(_x, _y))) {
                return MAX_TIME;
            }

            // console.log('move', _x, _y, _time);
            return dfs(_x, _y, _time);
        })
    );

    cache.set(cacheKey, min);
    return min;
};

const minutes = dfs(minX, minY - 1, 0);
console.log(minutes !== MAX_TIME ? minutes : 'Not found');

// for (let s = 0; s < 18; s++) {
//     console.log(s);
//     draw(blizzardsState(s));
// }

console.log('End');
