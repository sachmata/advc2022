import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 16');

// https://adventofcode.com/2022/day/XX/input

const valveRates = {};
const valveTunnel = {};

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

    valveRates[_name] = _rate;
    valveTunnel[_name] = _edges;
}

const EMPTY_SCORE = { open: false, move: false, score: 0 };

const scoresCache = {};
function getScore(valve, availableTime, open, ignore) {
    const key = [valve, String(availableTime).padStart(2, '0'), ...open, ...ignore].join('|');
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
            : (availableTime - 1) * valveRates[valve] +
              getScore(valve, availableTime - 1, [...open, valve].sort(), []).score;

    const moveScores = {};
    for (let tunnel of valveTunnel[valve]) {
        if (ignore.indexOf(tunnel) === -1) {
            moveScores[tunnel] = getScore(tunnel, availableTime - 1, open, []);
        }
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

const TOTAL_AVAILABLE_TIME = 26; // 30
let availableTime = TOTAL_AVAILABLE_TIME;

let currentMe = 'AA';
let currentElephant = 'AA';

let score = 0;
let open = [];

while (availableTime) {
    // const _scoreElephant = getScore(currentElephant, availableTime, open,[]);
    const scoreMe = getScore(currentMe, availableTime, open, []);

    availableTime--;

    console.log(`== Minute ${TOTAL_AVAILABLE_TIME - availableTime} ==`);

    const releasing = open.reduce((acc, o) => ((acc += valveRates[o]), acc), 0);
    score += releasing;

    console.log(`Opened valves (${open.join(', ')}) releasing ${releasing}`);

    if (scoreMe.open) {
        open = [...open, currentMe].sort();

        console.log('I open', currentMe);
    }

    if (scoreMe.move) {
        currentMe = scoreMe.move;

        console.log('I move to', currentMe);
    }

    // if (_scoreElephant.open) {
    //     open = [...open, currentElephant].sort();

    //     console.log('Elephant open', currentElephant);
    // }

    // if (_scoreElephant.move) {
    //     currentElephant = _scoreElephant.move;

    //     console.log('Elephant move to', currentElephant);
    // }
}

console.log(score); // 1580

console.log('End');
