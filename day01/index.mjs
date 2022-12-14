import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 1');

const elves = [0];

for (let line of fromFile('./day01/input.txt')) {
    if (line.length) {
        const mealCalories = Number(line);
        elves[elves.length - 1] += mealCalories;
    } else {
        elves.push(0);
    }
}

let maxIndex = 0;

for (let i = 0; i < elves.length; i++) {
    if (elves[i] > elves[maxIndex]) {
        maxIndex = i;
    }
}

console.log('Max', maxIndex, elves[maxIndex]); // 69883

console.log('Part two');

const sortElves = Array.from(elves.entries()).sort((a, b) => {
    return b[1] - a[1];
});

const top3Elves = sortElves.slice(0, 3);

console.log('Top 3', top3Elves);

const sumTop3 = top3Elves.reduce((acc, elf) => {
    return acc + elf[1];
}, 0);

console.log('Top 3 sum', sumTop3); // 207576

console.log('End');
