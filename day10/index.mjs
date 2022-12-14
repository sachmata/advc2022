import _ from 'lodash';

import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 10');

const instr = [];

for (let line of fromFile('./day10/input.txt')) {
    if (!line.length) {
        continue;
    }

    const tokens = line.split(' ');
    instr.push(tokens);
}

let cycle = 0;
let regX = 1; // general X register
let regPC = 0; // program counter register
let regIS = 0; // instruction step register

function execStep([instr, arg0, arg1]) {
    regIS++;

    if (instr === 'noop') {
        (regIS = 0), regPC++;
    } else if (instr === 'addx') {
        // 2 cycles
        if (regIS > 1) {
            regX += +arg0;
            (regIS = 0), regPC++;
        }
    } else {
        throw new Error(`Unknown instruction ${instr}`);
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

let sum = 0;

while (true) {
    cycle++;

    if (!((cycle - 20) % 40)) {
        // console.log('Test cycle', cycle, regX);
        sum += regX * cycle;
    }

    if (regPC >= instr.length) {
        break;
    }

    draw();
    execStep(instr[regPC]);

    // console.log(cycle, regE, regX);
}
// RLEZFLGE

console.log('Sum', sum); // 17020

console.log('End');
