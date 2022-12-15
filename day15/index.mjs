import _ from 'lodash';

import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 15');

// https://adventofcode.com/2022/day/15/input

const XY_REGEX = /^x=(?<x>-?\d+),\sy=(?<y>-?\d+)$/;

const data = [];

for (let line of fromFile('./day15/input.txt')) {
    if (!line.length) {
        continue;
    }

    let [sensorStr, beaconStr] = line.split(':');
    sensorStr = sensorStr.substring(10);
    beaconStr = beaconStr.substring(22);

    const sensorMatch = sensorStr.match(XY_REGEX);
    const beaconMatch = beaconStr.match(XY_REGEX);

    const sensor = { x: +sensorMatch.groups.x, y: +sensorMatch.groups.y };
    const beacon = { x: +beaconMatch.groups.x, y: +beaconMatch.groups.y };

    data.push({ sensor, beacon });
}

function sensorCoverage({ sensor, beacon }, row) {
    const distance = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
    const delta = Math.abs(sensor.y - row);
    if (delta > distance) {
        return [];
    }

    const start = sensor.x - distance + delta;
    const end = sensor.x + distance - delta;

    return { start, end };
}

const ROW = 2000000;

let rowCoverage = new Set();
for (const pair of data) {
    const { start, end } = sensorCoverage(pair, ROW);
    for (let i = start; i <= end; i++) {
        rowCoverage.add(i);
    }
}

// exclude beacons
for (const pair of data) {
    if (pair.beacon.y === ROW) {
        rowCoverage.delete(pair.beacon.x);
    }
}

console.log(rowCoverage.size);

console.log('End');
