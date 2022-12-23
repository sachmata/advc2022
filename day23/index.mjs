import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 23');

// https://adventofcode.com/2022/day/23/input

const OFFSETS = {
    N: [0, -1],
    NE: [1, -1],
    E: [1, 0],
    SE: [1, 1],
    S: [0, 1],
    SW: [-1, 1],
    W: [-1, 0],
    NW: [-1, -1],
};

const LOOK_GROUP = {
    N: ['NE', 'N', 'NW'],
    S: ['SE', 'S', 'SW'],
    W: ['NW', 'W', 'SW'],
    E: ['NE', 'E', 'SE'],
};

const elves = new Map();
const proposals = new Map();
const lookOrder = ['N', 'S', 'W', 'E'];

const key = (x, y) => [x, y].join('|');

function draw() {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    for (let elf of elves.values()) {
        if (minX > elf.x) {
            minX = elf.x;
        }
        if (maxX < elf.x) {
            maxX = elf.x;
        }
        if (minY > elf.y) {
            minY = elf.y;
        }
        if (maxY < elf.y) {
            maxY = elf.y;
        }
    }

    for (let y = minY; y <= maxY; y++) {
        let line = '';
        for (let x = minX; x <= maxX; x++) {
            line += elves.has(key(x, y)) ? '#' : '.';
        }
        console.log(line);
    }
    console.log();
}

class Elf {
    x;
    y;

    proposal;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    key() {
        return key(this.x, this.y);
    }

    stepOne() {
        const hasNeighbors = Object.values(OFFSETS).some(([x, y]) =>
            elves.has(key(this.x + x, this.y + y))
        );
        if (!hasNeighbors) {
            return;
        }

        for (const look of lookOrder) {
            const isEmpty = LOOK_GROUP[look].every(pos => {
                const [x, y] = OFFSETS[pos];
                return !elves.has(key(this.x + x, this.y + y));
            });

            if (isEmpty) {
                this.proposal = look;

                const [x, y] = OFFSETS[this.proposal];
                const _pos = key(this.x + x, this.y + y);

                if (proposals.has(_pos)) {
                    proposals.get(_pos).push(this);
                } else {
                    proposals.set(_pos, [this]);
                }

                break;
            }
        }
    }

    stepTwo() {
        if (!this.proposal) {
            return;
        }

        const [x, y] = OFFSETS[this.proposal];
        const _pos = key(this.x + x, this.y + y);

        if (proposals.get(_pos).length === 1) {
            const _key = this.key();
            elves.delete(_key);

            this.x += x;
            this.y += y;

            elves.set(this.key(), this);

            // console.log(_key, 'moves', this.proposal, 'to', this.key());
        }

        this.proposal = null;
    }
}

const _OFFSET = 10; // just to keep coordinates positive
let y = 0;
for (let line of fromFile('./day23/input.txt')) {
    if (!line.length) {
        continue;
    }

    const _row = line.split('');
    for (let x = 0; x < _row.length; x++) {
        if (_row[x] === '#') {
            const elf = new Elf(_OFFSET + x, _OFFSET + y);
            elves.set(elf.key(), elf);
        }
    }

    y++;
}

// draw();

for (let round = 0; round < 10; round++) {
    // console.log('Round', round + 1);

    proposals.clear();

    for (let elf of elves.values()) {
        elf.stepOne();
    }

    for (let elf of elves.values()) {
        elf.stepTwo();
    }

    lookOrder.push(lookOrder.shift());

    // draw();
}

let minX = Number.MAX_SAFE_INTEGER;
let maxX = Number.MIN_SAFE_INTEGER;
let minY = Number.MAX_SAFE_INTEGER;
let maxY = Number.MIN_SAFE_INTEGER;

for (let elf of elves.values()) {
    if (minX > elf.x) {
        minX = elf.x;
    }
    if (maxX < elf.x) {
        maxX = elf.x;
    }
    if (minY > elf.y) {
        minY = elf.y;
    }
    if (maxY < elf.y) {
        maxY = elf.y;
    }
}

const patch = (maxX - minX + 1) * (maxY - minY + 1);
console.log(patch - elves.size); //6724

console.log('End');
