import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 19');

// https://adventofcode.com/2022/day/XX/input

const blueprints = [];

for (let line of fromFile('./day19/example.txt')) {
    if (!line.length) {
        continue;
    }

    const [_, l] = line.split(': ');
    const [lOre, lClay, lObsidian, lGeode] = l.split('.').map(s => s.trim());

    const cOreMatch = lOre.match(/^.+ (?<ore>\d+) ore$/);
    const cClayMatch = lClay.match(/^.+ (?<ore>\d+) ore$/);
    const cObsidianMatch = lObsidian.match(/^.+ (?<ore>\d+) ore and (?<clay>\d+) clay$/);
    const cGeodeMatch = lGeode.match(/^.+ (?<ore>\d+) ore and (?<obsidian>\d+) obsidian$/);

    blueprints.push([
        +cOreMatch.groups.ore,
        +cClayMatch.groups.ore,
        [+cObsidianMatch.groups.ore, +cObsidianMatch.groups.clay],
        [+cGeodeMatch.groups.ore, +cGeodeMatch.groups.obsidian],
    ]);
}

console.log(blueprints);

console.log('End');
