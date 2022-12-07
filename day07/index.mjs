import _ from 'lodash';

import { fromFile } from '../lib/readlines.mjs';

console.log('Day 7');

const path = ['/'];
const root = {};

const sum = {};

let lsMode = false;

for (let line of fromFile('./day07/input.txt')) {
    if (!line) {
        continue;
    }

    if (line.startsWith('$ cd ')) {
        lsMode = false;

        // cd
        const dir = line.substr(5);
        if (dir === '/') {
            path.splice(1);
        } else if (dir === '..') {
            path.splice(-1);
        } else {
            path.push(dir);
        }
    } else if (line.startsWith('$ ls')) {
        lsMode = true;
    } else if (lsMode && line.startsWith('dir ')) {
        const dir = line.substr(4);
        if (!_.get(root, [...path, dir])) {
            _.set(root, [...path, dir], {});
        }
    } else if (lsMode) {
        const [size, file] = line.split(' ');
        _.set(root, [...path, file], +size);

        for (let i = path.length; i > 0; i--) {
            const _path = path.slice(0, i).join('.');

            sum[_path] = (sum[_path] || 0) + +size;
        }
    }
}

let resultA = 0;
for (let dir in sum) {
    if (sum[dir] < 100000) {
        resultA += sum[dir];
    }
}

console.log(resultA);

console.log('Part two');

const total = 70000000;
const needed = 30000000;

const used = sum['/'];
const free = total - used;

const toDelete = needed - free;
const dirToDelete = Object.entries(sum)
    .filter(([_, size]) => size > toDelete)
    .sort((a, b) => a[1] - b[1]);

console.log(dirToDelete[0][1]);

console.log('End');
