import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 17');

// https://adventofcode.com/2022/day/XX/input

let jetPattern = '';
let jetCursor = 0;

for (let line of fromFile('./day17/input.txt')) {
    if (!line.length) {
        continue;
    }

    jetPattern = line;
}

function nextJet() {
    const next = jetPattern[jetCursor];
    jetCursor = (jetCursor + 1) % jetPattern.length;
    return next;
}

// inverted !
const rockPatterns = [
    [
        ['@', '@', '@', '@'], //
    ],
    [
        ['.', '@', '.'], //
        ['@', '@', '@'],
        ['.', '@', '.'],
    ],
    [
        ['@', '@', '@'], //
        ['.', '.', '@'],
        ['.', '.', '@'],
    ],
    [
        ['@'], //
        ['@'],
        ['@'],
        ['@'],
    ],
    [
        ['@', '@'], //
        ['@', '@'],
    ],
];

let rockCursor = 0;
function nextRockPattern() {
    const next = rockPatterns[rockCursor];
    rockCursor = (rockCursor + 1) % rockPatterns.length;
    return next;
}

const CHAMBER_WIDE = 7;
const EMPTY_CHAMBER_LAYER = '.'.repeat(CHAMBER_WIDE).split('');

let chamber = [];
let layersTrimmed = 0;

let chamberTop = -1; // null

let rockTop = -1; // null
let rockLeft = -1; // null
let rockWidth = -1; // null
let rockHeight = -1; // null

function draw() {
    // return;

    console.log('c', chamberTop, 't', rockTop, 'l', rockLeft);

    for (let y = chamber.length - 1; y >= 0; y--) {
        const absolute = String(y + layersTrimmed).padStart(4, '0');
        const relative = String(y).padStart(3, '0');

        console.log(`${absolute}(${relative}) |${chamber[y].join('')}|`);
    }
    if (!layersTrimmed) {
        console.log(`          +${'-'.repeat(CHAMBER_WIDE)}+`);
    }
    console.log(``);
}

function addRock() {
    const rock = nextRockPattern();

    const startLayer = chamberTop + 4;

    const layersToAdd = Math.max(0, startLayer + rock.length - chamber.length);
    for (let i = 0; i < layersToAdd; i++) {
        chamber.push([...EMPTY_CHAMBER_LAYER]);
    }

    for (let i = 0; i < rock.length; i++) {
        chamber[startLayer + i].splice(2, rock[i].length, ...rock[i]);
    }

    rockHeight = rock.length;
    rockWidth = rock[0].length;
    rockTop = startLayer + (rockHeight - 1);
    rockLeft = 2;

    // console.log('Add');
    // draw();
}

function step() {
    const jet = nextJet();

    // console.log('Jet', jet);

    const rockLayers = [];
    for (let i = 0; i < rockHeight; i++) {
        rockLayers.push(rockTop - i);
    }

    if (jet === '>') {
        const canMoveRight = rockLayers.every(l => {
            const layer = chamber[l];
            const right = layer.lastIndexOf('@');
            return layer[right + 1] === '.';
        });

        if (canMoveRight) {
            rockLayers.forEach(l => {
                const layer = chamber[l];
                for (let i = layer.length - 1; i >= 0; i--) {
                    if (layer[i] === '@') {
                        layer[i] = '.';
                        layer[i + 1] = '@';
                    }
                }
            });

            rockLeft++;
        }
    }

    if (jet === '<') {
        const canMoveLeft = rockLayers.every(l => {
            rockLayers;

            const layer = chamber[l];
            const left = layer.indexOf('@');
            return layer[left - 1] === '.';
        });

        if (canMoveLeft) {
            rockLayers.forEach(l => {
                const layer = chamber[l];

                for (let i = 0; i < layer.length; i++) {
                    if (layer[i] === '@') {
                        layer[i] = '.';
                        layer[i - 1] = '@';
                    }
                }
            });

            rockLeft--;
        }
    }

    const rockColumns = [];
    for (let i = 0; i < rockWidth; i++) {
        rockColumns.push(rockLeft + i);
    }

    const canMoveDown =
        rockLayers[rockLayers.length - 1] > 0 &&
        rockColumns.every(c => {
            const column = [...rockLayers, rockLayers[rockLayers.length - 1] - 1].map(
                l => chamber[l][c]
            );
            const bottom = column.lastIndexOf('@');
            return column[bottom + 1] === '.';
        });

    if (canMoveDown) {
        rockColumns.forEach(c => {
            for (let i = rockLayers.length - 1; i >= 0; i--) {
                const l = rockLayers[i];

                if (chamber[l][c] === '@') {
                    chamber[l][c] = '.';
                    chamber[l - 1][c] = '@';
                }
            }
        });

        rockTop--;
    } else {
        // freeze
        rockLayers.forEach(l => {
            const layer = chamber[l];
            for (let i = 0; i < layer.length; i++) {
                if (layer[i] === '@') {
                    layer[i] = '#';
                }
            }
        });

        chamberTop = Math.max(chamberTop, rockTop);

        rockTop = -1; // null
        rockLeft = -1; // null
        rockHeight = -1; // null
        rockWidth = -1; // null

        if (chamber.length > 900) {
            const trim = chamber.length - 850;
            layersTrimmed += trim;
            chamberTop -= trim;

            chamber = chamber.slice(trim);
        }

        // draw();
        return false;
    }

    // draw();
    return true;
}

let rocksStopped = 0;
while (rocksStopped < 2022) {
    addRock();
    while (step()) {}
    rocksStopped++;
}

draw();

console.log(layersTrimmed + chamberTop + 1);

console.log('End');
