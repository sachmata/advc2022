import cyrb53 from '../lib/cyrb53.mjs';
import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 16');

// https://adventofcode.com/2022/day/XX/input

const valves = {};
const tunnels = {};

for (let line of fromFile('./day16/input.txt')) {
    if (!line.length) {
        continue;
    }

    let [a, b] = line.split(';');

    const _name = a.substring(6, 8);
    const _rate = +a.substring(23);
    const _edges = b
        .replace(' tunnel leads to valve ', '')
        .replace(' tunnels lead to valves ', '')
        .split(', ');

    valves[_name] = _rate;
    tunnels[_name] = _edges;
}

// console.log(valves, tunnels);

// hyper-neutrino solution - https://www.youtube.com/watch?v=bLMj50cpOug&t=584s

const distances = {};

for (let valve in valves) {
    // ignore 0 valves unless AA
    if (!valves[valve] && valve !== 'AA') {
        continue;
    }

    distances[valve] = { [valve]: 0, AA: 0 }; // don't check self and start

    const visited = new Set([valve]);
    const queue = [[valve, 0]];

    while (queue.length) {
        const [position, distance] = queue.shift();

        for (let neighbor of tunnels[position]) {
            if (visited.has(neighbor)) continue;
            visited.add(neighbor);

            const _distance = distance + 1;
            if (valves[neighbor]) {
                distances[valve][neighbor] = _distance;
            }
            queue.push([neighbor, _distance]);
        }
    }

    delete distances[valve][valve];
    if (valve !== 'AA') {
        delete distances[valve]['AA'];
    }
}

// console.log(distances);

// rotating cache as single map has about 16M limit size
const caches = [new Map()];

const cacheSet = (key, value) => {
    let cache = caches[caches.length - 1];
    if (cache.size > 10e6) {
        cache = new Map();
        caches.push(cache);
    }
    cache.set(key, value);
};
const cacheGet = key => {
    for (let cache of caches) if (cache.has(key)) return cache.get(key);
    return undefined;
};
// const cacheHas = key => {
//     for (let cache of caches) if (cache.has(key)) return true;
//     return false;
// };

function dfs(time, valve, open) {
    // use number for key, strings overflow the heap
    // cyrb53 is better than murmurhash which have collisions
    const key = cyrb53([String(time), valve, ...open].join('|'));
    const cached = cacheGet(key);
    if (cached) return cached;

    let score = 0;

    for (let neighbor of Object.keys(distances[valve])) {
        if (open.has(neighbor)) continue;

        const _time = time - distances[valve][neighbor] - 1;
        if (_time <= 0) continue;

        score = Math.max(
            score,
            dfs(_time, neighbor, new Set([...open, neighbor])) + valves[neighbor] * _time
        );
    }

    cacheSet(key, score);
    return score;
}

// const result = dfs(30, 'AA', new Set());
// console.log(result); // 1580

console.log('Part two');

// // last solution before string key crash
// const resultA = dfs(26, 'AA', new Set(['CR', 'IK', 'IT', 'JE', 'KI', 'SQ', 'YB']));
// const resultB = dfs(26, 'AA', new Set(['DS', 'FS', 'HG', 'MD', 'PZ', 'SS', 'TX', 'YW']));
// console.log(resultA, resultB, resultA + resultB); // 1177 1036 2213

const goodValves = Object.keys(valves)
    .filter(v => valves[v])
    .sort();
const valvesBitArray = (1 << goodValves.length) - 1; // all 1s

let max = 0;

const combinations = (valvesBitArray + 1) / 2;
for (let i = 0; i < combinations; i++) {
    const a = new Set();
    const b = new Set();

    for (let k = 0; k < goodValves.length; k++) {
        ((i >> k) & 1 ? a : b).add(goodValves[k]);
    }

    const result = dfs(26, 'AA', a) + dfs(26, 'AA', b);
    if (max < result) {
        max = result;

        console.log(i, result);
        console.log(JSON.stringify([...a]), JSON.stringify([...b]));
    }

    if (!(i % 1e3)) {
        console.log(i, 'from', combinations);
        // console.log(caches.map(c => c.size));
    }
}

console.log(max);

console.log('End');
