import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 16');

// https://adventofcode.com/2022/day/XX/input

const valves = {};
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

    valves[_name] = { name: _name, rate: _rate, openAt: null };
    edges[_name] = _edges;
}

function cloneValves(valves) {
    return JSON.parse(JSON.stringify(valves));
}

const AVAILABLE_TIME = 20;

function visitValve(valveName, valves, releaseFlow, elapsedTime) {
    if (elapsedTime >= AVAILABLE_TIME) {
        return releaseFlow;
    }

    console.log(valveName, elapsedTime);

    const currentValve = valves[valveName];

    // case 1: openValve & move
    let openAndMoveResult = 0;
    if (currentValve.rate > 0 && !currentValve.openAt) {
        const _valves = cloneValves(valves);
        const _valve = _valves[valveName];
        const _elapsedTime = elapsedTime + 1;
        const _releaseFlow = releaseFlow + (AVAILABLE_TIME - _elapsedTime) * _valve.rate;

        _valve.openAt = _elapsedTime;

        const results = edges[valveName]
            .map(n => valves[n])
            .map(valve =>
                visitValve(valve.name, cloneValves(_valves), _releaseFlow, _elapsedTime + 1)
            )
            .sort((a, b) => b - a);
        if (results.length) {
            openAndMoveResult = results[0];
        }
    }

    // case 2: move
    let onlyMoveResult = 0;
    {
        const _valves = valves;
        const _elapsedTime = elapsedTime;
        const _releaseFlow = releaseFlow;

        const results = edges[valveName]
            .map(n => valves[n])
            .map(valve =>
                visitValve(valve.name, cloneValves(_valves), _releaseFlow, _elapsedTime + 1)
            )
            .sort((a, b) => b - a);
        if (results.length) {
            onlyMoveResult = results[0];
        }
    }

    return Math.max(openAndMoveResult, onlyMoveResult);
}

const result = visitValve('AA', valves, 0, 0);

console.log(result);

console.log('End');
