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

    const visible = visibleUp || visibleDown || visibleLeft || visibleRight;
    const score = upScore * downScore * rightScore * leftScore;

    // console.log(`(${row}, ${column})`, visible ? '.' : 'X', score);

    return [visible, score];
}

let visibleSum = 0;
let maxScore = 0;

for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
        const [visible, score] = checkTree(row, column);

        if (visible) {
            visibleSum++;
        }

        if (score > maxScore) {
            maxScore = score;
        }
    }
}

console.log('Visible sum', visibleSum);

console.log('Part two');

console.log('Max score', maxScore);

console.log('End');
