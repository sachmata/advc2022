import cyrb53 from '../lib/cyrb53.mjs';
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

    blueprints.push({
        ore: { ore: +cOreMatch.groups.ore },
        clay: { ore: +cClayMatch.groups.ore },
        obsidian: { ore: +cObsidianMatch.groups.ore, clay: +cObsidianMatch.groups.clay },
        geode: { ore: +cGeodeMatch.groups.ore, obsidian: +cGeodeMatch.groups.obsidian },
    });
}

// console.log(blueprints);

// rotating cache as single map has about 16M limit size
const caches = [new Map()];

const cacheSet = (key, value) => {
    let cache = caches[caches.length - 1];
    if (cache.size > 10e6) {
        cache = new Map();
        caches.push(cache);
    }
    cache.set(key, value);
};
const cacheGet = key => {
    for (let cache of caches) if (cache.has(key)) return cache.get(key);
    return undefined;
};
// const cacheHas = key => {
//     for (let cache of caches) if (cache.has(key)) return true;
//     return false;
// };

let maxMax = 0;

function dfs(blueprintIndex, robots, resources, time) {
    // use number for key, strings overflow the heap
    // cyrb53 is better than murmurhash which have collisions
    const key = cyrb53(
        [
            blueprintIndex, //
            ...Object.values(robots),
            ...Object.values(resources),
            time,
        ].join('|')
    );
    const cached = cacheGet(key);
    if (cached) return cached;

    const blueprint = blueprints[blueprintIndex];

    // console.log(blueprint, robots, resources, time);

    if (time <= 0) {
        const result = resources.geode;
        if (maxMax < result) {
            maxMax = result;
            console.log('maxMax', result);
            console.log(caches.map(c => c.size));
        }
        return result;
    }

    let max = 0;

    const newTime = time - 1;

    // collected resources by each robot
    const newResources = {
        ore: resources.ore + robots.ore,
        clay: resources.clay + robots.clay,
        obsidian: resources.obsidian + robots.obsidian,
        geode: resources.geode + robots.geode,
    };

    // build geode robot
    if (resources.ore >= blueprint.geode.ore && resources.obsidian >= blueprint.geode.obsidian) {
        max = Math.max(
            max,
            dfs(
                blueprintIndex,
                {
                    ...robots,
                    geode: robots.geode + 1,
                },
                {
                    ...newResources,
                    ore: newResources.ore - blueprint.geode.ore,
                    obsidian: newResources.obsidian - blueprint.geode.obsidian,
                },
                newTime
            )
        );
    }

    // build obsidian robot
    if (resources.ore >= blueprint.obsidian.ore && resources.clay >= blueprint.obsidian.clay) {
        max = Math.max(
            max,
            dfs(
                blueprintIndex,
                {
                    ...robots,
                    obsidian: robots.obsidian + 1,
                },
                {
                    ...newResources,
                    ore: newResources.ore - blueprint.obsidian.ore,
                    clay: newResources.clay - blueprint.obsidian.clay,
                },
                newTime
            )
        );
    }

    // build clay robot
    if (resources.ore >= blueprint.clay.ore) {
        max = Math.max(
            max,
            dfs(
                blueprintIndex,
                {
                    ...robots,
                    clay: robots.clay + 1,
                },
                {
                    ...newResources,
                    ore: newResources.ore - blueprint.clay.ore,
                },
                newTime
            )
        );
    }

    // build ore robot
    if (resources.ore >= blueprint.ore.ore) {
        max = Math.max(
            max,
            dfs(
                blueprintIndex,
                {
                    ...robots,
                    ore: robots.ore + 1,
                },
                {
                    ...newResources,
                    ore: newResources.ore - blueprint.ore.ore,
                },
                newTime
            )
        );
    }

    // wait (collect resources)
    max = Math.max(max, dfs(blueprintIndex, robots, newResources, newTime));

    cacheSet(key, max);
    return max;
}

const START_ROBOTS = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
const START_RESOURCES = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
const START_TIME = 24;

const results = [];

// for (let blueprintIndex = 0; blueprintIndex < blueprints.length; blueprintIndex++) {
let blueprintIndex = 0;

const geodes = dfs(blueprintIndex, START_ROBOTS, START_RESOURCES, START_TIME);
const quality = geodes * (blueprintIndex + 1);

results.push([blueprintIndex, geodes, quality]);
// }

console.log(results);

console.log('End');
