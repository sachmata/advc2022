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
        return null;
    }

    const start = sensor.x - distance + delta;
    const end = sensor.x + distance - delta;

    return { start, end };
}

const ROW = 2000000;

let rowCoverage = new Set();
for (const pair of data) {
    const coverage = sensorCoverage(pair, ROW);
    if (!coverage) {
        continue;
    }

    const { start, end } = coverage;
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

console.log('Positions', rowCoverage.size); // 4665948

console.log('Part two');

function mergeIntervals(intervals) {
    if (intervals.length < 2) {
        return intervals;
    }

    intervals.sort((a, b) => a[0] - b[0]);

    const result = [];

    let previous = intervals[0];
    for (let i = 1; i < intervals.length; i++) {
        if (previous[1] >= intervals[i][0]) {
            previous = [previous[0], Math.max(previous[1], intervals[i][1])];
        } else {
            result.push(previous);
            previous = intervals[i];
        }
    }

    result.push(previous);

    return result;
}

const MAX = 4e6;

for (let y = 0; y <= MAX; y++) {
    const intervals = [];

    for (const pair of data) {
        const coverage = sensorCoverage(pair, y);
        if (!coverage) {
            continue;
        }

        if (coverage.end < 0 || coverage.start > MAX) {
            continue;
        }

        const start = Math.max(coverage.start, 0);
        const end = Math.min(coverage.end, MAX);

        intervals.push([start, end + 1]);
    }

    const _intervals = mergeIntervals(intervals);

    if (_intervals.length > 1) {
        const x = _intervals[0][1];
        const freq = x * 4e6 + y;

        console.log('Frequency', freq); // 13543690671045

        break;
    }
}

console.log('End');
