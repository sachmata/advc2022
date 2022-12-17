import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 16');

// https://adventofcode.com/2022/day/XX/input

const valveRates = {};
const valveTunnel = {};

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

    valveRates[_name] = _rate;
    valveTunnel[_name] = _edges;
}

const EMPTY_SCORE = { open: false, move: false, score: 0 };

const scoresCache = {};
function getScore(valve, availableTime, open) {
    const key = `${valve}|${String(availableTime).padStart(2, '0')}|${open.join('|')}`;
    let result = scoresCache[key];
    if (result) {
        return result;
    }

    if (availableTime <= 0) {
        return EMPTY_SCORE;
    }

    const openScore =
        open.indexOf(valve) !== -1 || !valveRates[valve]
            ? 0
            : (availableTime - 1) * valveRates[valve];

    const moveScores = {};
    for (let tunnel of valveTunnel[valve]) {
        moveScores[tunnel] = getScore(tunnel, availableTime - 1, open);
    }

    const maxMoveScoreEdge = Object.keys(moveScores).sort(
        (a, b) => moveScores[b].score - moveScores[a].score
    )[0];
    const maxMoveScore = moveScores[maxMoveScoreEdge];

    const score =
        openScore > maxMoveScore.score
            ? { open: true, move: null, score: openScore }
            : maxMoveScore.score
            ? { open: false, move: maxMoveScoreEdge, score: maxMoveScore.score }
            : EMPTY_SCORE;

    scoresCache[key] = score;

    return score;
}

const TOTAL_AVAILABLE_TIME = 30;
let availableTime = TOTAL_AVAILABLE_TIME;
let current = 'AA';
let score = 0;
let open = [];

while (availableTime) {
    const _score = getScore(current, availableTime, open);

    availableTime--;

    console.log(`== Minute ${TOTAL_AVAILABLE_TIME - availableTime} ==`);

    const releasing = open.reduce((acc, o) => ((acc += valveRates[o]), acc), 0);
    score += releasing;

    console.log(`Opened valves (${open.join(', ')}) releasing ${releasing}`);

    if (_score.open) {
        open = [...open, current].sort();

        console.log('Open', current);
        continue;
    }

    if (_score.move) {
        current = _score.move;

        console.log('Move to', current);
        continue;
    }
}

console.log(score);

console.log('End');
