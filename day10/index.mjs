import _ from 'lodash';

import { fromFile } from '../lib/readlines.mjs';

console.log('Day 10');

const commands = [];

for (let line of fromFile('./day10/input.txt')) {
    const tokens = line.split(' ');
    commands.push(tokens);
}

let cycle = 0;
let regX = 1;
let regE = 0;

function execStep(command) {
    if (command[0] === 'noop') {
        return true;
    } else if (command[0] === 'addx') {
        if (command.length === 2) {
            command[2] = '+';
            return false;
        } else {
            regX += +command[1];
            return true;
        }
    } else {
        throw new Error(`Unknown instruction ${command}`);
    }
}

let line = '';

function draw() {
    // const row = Math.floor((cycle - 1) / 40);
    const pixel = (cycle - 1) % 40;

    line += Math.abs(pixel - regX) < 2 ? '#' : '.';

    if (pixel === 39) {
        console.log(line);
        line = '';
    }
}

const testCycles = new Set([20, 60, 100, 140, 180, 220]);

let sum = 0;

while (true) {
    cycle++;

    if (testCycles.has(cycle)) {
        // console.log('Test cycle', cycle, regX);
        sum += regX * cycle;
    }

    if (regE >= commands.length) {
        break;
    }

    draw();

    if (execStep(commands[regE])) {
        regE++;
    }

    // console.log(cycle, regE, regX);
}

console.log('Sum', sum);

console.log('End');
