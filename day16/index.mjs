import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 16');

// https://adventofcode.com/2022/day/XX/input

const rates = {};
const edges = {};

for (let line of fromFile('./day16/example.txt')) {
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

    rates[_name] = _rate;
    edges[_name] = _edges;
}

function BFS(start, end) {
    const visited = {};
    const distance = {};

    visited[start] = true;
    distance[start] = 0;

    const queue = [start];

    while (!distance[end] && queue.length) {
        const current = queue.shift();

        for (let node of edges[current]) {
            if (visited[node]) {
                continue;
            }

            visited[node] = true;
            distance[node] = distance[current] + 1;

            queue.push(node);
        }
    }

    return distance[end];
}

const opened = {};

let flow = 0;
let availableTime = 30;
let current = 'AA';

while (availableTime) {
    const distance = Object.keys(rates)
        .filter(v => v !== current && !opened[v] && !!rates[v])
        .reduce((acc, v) => ((acc[v] = BFS(current, v)), acc), {});

    console.log(
        Object.keys(distance).map(
            v =>
                `${v}: ${distance[v]} ${rates[v]} ${(availableTime - (distance[v] + 1)) * rates[v]}`
        )
    );

    const next = Object.keys(distance).sort((a, b) => {
        const _a = (availableTime - (distance[a] + 1)) * rates[a];
        const _b = (availableTime - (distance[b] + 1)) * rates[b];

        return _b - _a;
    })[0];

    if (!next) {
        break;
    }

    console.log(current, '->', next, distance[next]);

    availableTime -= distance[next] + 1;
    opened[next] = true;
    flow += availableTime * rates[next];

    current = next;
}

console.log(flow, availableTime);

console.log('End');
