import _ from 'lodash';

import { fromFile } from '../lib/readlines.mjs';

console.log('Day 8');

const trees = [];

for (let line of fromFile('./day08/input.txt')) {
    const row = line.split('');
    trees.push(row);
}

const columns = trees[0].length;
const rows = trees.length;

function checkTree(row, column) {
    const height = trees[row][column];

    let visibleUp = true;
    let upScore = row;
    for (let u = row - 1; u >= 0; u--) {
        const h = trees[u][column];
        if (h >= height) {
            visibleUp = false;
            upScore = row - u;
            break;
        }
    }

    let visibleDown = true;
    let downScore = rows - row - 1;
    for (let d = row + 1; d < rows; d++) {
        const h = trees[d][column];
        if (h >= height) {
            visibleDown = false;
            downScore = d - row;
            break;
        }
    }

    let visibleRight = true;
    let rightScore = columns - column - 1;
    for (let r = column + 1; r < columns; r++) {
        const h = trees[row][r];
        if (h >= height) {
            visibleRight = false;
            rightScore = r - column;
            break;
        }
    }

    let visibleLeft = true;
    let leftScore = column;
    for (let l = column - 1; l >= 0; l--) {
        const h = trees[row][l];
        if (h >= height) {
            visibleLeft = false;
            leftScore = column - l;
            break;
        }
    }

    const visible = visibleUp || visibleDown || visibleLeft || visibleRight ? 1 : 0;
    const score = upScore * downScore * rightScore * leftScore;

    console.log(`(${row}, ${column})`, visible ? '.' : 'X', score);

    return [visible, score];
}

let visibleSum = 0;
let maxScore = 0;

// TODO: this works ok for square forest with even side
for (let ring = 0; ring < rows / 2; ring++) {
    const ringColumns = columns - 2 * ring;
    const ringRows = rows - 2 * ring;
    const ringTrees = 2 * (ringRows + ringColumns - 2); // inner ring 1x1 gives 0

    // console.log(ring, ringColumns, ringRows, ringTrees);

    const a = _.range(ring, columns - ring - 1).map(column => [ring, column]);
    const b = _.range(ring, rows - ring - 1).map(row => [row, columns - ring - 1]);
    const c = _.range(ring + 1, columns - ring).map(column => [rows - ring - 1, column]);
    const d = _.range(ring + 1, rows - ring).map(row => [row, ring]);

    const aResult = a.map(c => checkTree(...c));
    const bResult = b.map(c => checkTree(...c));
    const cResult = c.map(c => checkTree(...c));
    const dResult = d.map(c => checkTree(...c));

    visibleSum += [
        ...aResult.map(([visible]) => visible),
        ...bResult.map(([visible]) => visible),
        ...cResult.map(([visible]) => visible),
        ...dResult.map(([visible]) => visible),
    ].reduce((acc, r) => acc + r, 0);

    const score = Math.max(
        ...[
            ...aResult.map(([_, score]) => score),
            ...bResult.map(([_, score]) => score),
            ...cResult.map(([_, score]) => score),
            ...dResult.map(([_, score]) => score),
        ]
    );
    if (score > maxScore) {
        maxScore = score;
    }
}

console.log(visibleSum);
console.log(maxScore);

// console.log('Part two');

console.log('End');
