import Cache from '../lib/cache.mjs';
import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 19');

// https://adventofcode.com/2022/day/XX/input

const blueprints = [];

for (let line of fromFile('./day19/input.txt')) {
    if (!line.length) {
        continue;
    }

    const [_, l] = line.split(': ');
    const [lOre, lClay, lObsidian, lGeode] = l.split('.').map(s => s.trim());

    const cOreMatch = lOre.match(/^.+ (?<ore>\d+) ore$/);
    const cClayMatch = lClay.match(/^.+ (?<ore>\d+) ore$/);
    const cObsidianMatch = lObsidian.match(/^.+ (?<ore>\d+) ore and (?<clay>\d+) clay$/);
    const cGeodeMatch = lGeode.match(/^.+ (?<ore>\d+) ore and (?<obsidian>\d+) obsidian$/);

    const recipes = {
        ore: { ore: +cOreMatch.groups.ore },
        clay: { ore: +cClayMatch.groups.ore },
        obsidian: { ore: +cObsidianMatch.groups.ore, clay: +cObsidianMatch.groups.clay },
        geode: { ore: +cGeodeMatch.groups.ore, obsidian: +cGeodeMatch.groups.obsidian },
    };

    const maxSpend = Object.keys(recipes)
        .filter(k => k !== 'geode')
        .reduce(
            (acc, key1) => (
                (acc[key1] = Math.max(
                    ...Object.keys(recipes).map(key2 => recipes[key2][key1] || 0)
                )),
                acc
            ),
            { geode: Number.MAX_SAFE_INTEGER }
        );

    blueprints.push({ recipes, maxSpend });
}

// console.log(blueprints);

const timeNeeded = (robots, resources, recipe) =>
    Math.max(
        ...Object.keys(recipe).map(key =>
            !robots[key] ? Infinity : Math.ceil((recipe[key] - resources[key]) / robots[key])
        ),
        0
    );

const newResources = (robots, resources, time, recipe) => {
    const _new = {};
    for (const key in resources) {
        _new[key] = resources[key] + time * robots[key] - (recipe[key] || 0);
    }
    return _new;
};

const cache = new Cache();

const dfs = (blueprintIndex, robots, resources, time) => {
    const key = [
        blueprintIndex, //
        ...Object.values(robots),
        ...Object.values(resources),
        time,
    ].join('|');
    const cached = cache.get(key);
    if (cached) return cached;

    if (time <= 0) {
        return resources.geode;
    }

    let max = resources.geode + robots.geode * time;

    const { recipes, maxSpend } = blueprints[blueprintIndex];

    // build robots
    for (const key in recipes) {
        if (robots[key] >= maxSpend[key]) continue;

        const recipe = recipes[key];

        const time_ = timeNeeded(robots, resources, recipe) + 1;
        if (time_ > time) continue;

        const resources_ = newResources(robots, resources, time_, recipe);

        const result_ = dfs(
            blueprintIndex,
            { ...robots, [key]: robots[key] + 1 },
            resources_,
            time - time_
        );

        max = Math.max(max, result_);
    }

    cache.set(key, max);
    return max;
};

const START_ROBOTS = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
const START_RESOURCES = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
const START_TIME = 24;

const results = [];

for (let blueprintIndex = 0; blueprintIndex < blueprints.length; blueprintIndex++) {
    console.log('Blueprint', blueprintIndex + 1);

    const geodes = dfs(blueprintIndex, START_ROBOTS, START_RESOURCES, START_TIME);
    cache.reset();

    console.log('Max geodes', geodes, '\n');
    results.push(geodes);
}

console.log(
    'Part one',
    'Quality:',
    results.reduce((acc, g, i) => ((acc += (i + 1) * g), acc), 0)
); // 1349
// console.log(results.reduce((acc, g) => ((acc *= g), acc), 1));

console.log('End');
