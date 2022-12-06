import fs from 'node:fs';

console.log('Day 6');

const examples4 = [
    'mjqjpqmgbljsphdztnvjfqwrcgsmlb', // 7
    'bvwbjplbgvbhsrlpgdmjqwftvncz', // 5
    'nppdvjthqldpwncqszvftbrmjlhg', // 6
    'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', // 10
    'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', // 11
];

const examples14 = [
    'mjqjpqmgbljsphdztnvjfqwrcgsmlb', // 19
    'bvwbjplbgvbhsrlpgdmjqwftvncz', // 23
    'nppdvjthqldpwncqszvftbrmjlhg', // 23
    'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', // 29
    'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', // 26
];

const input = fs.readFileSync('./day06/input.txt', { encoding: 'utf8' });

function indexOfUniquePatch(input, length) {
    let start = 0;
    for (let end = length; end <= input.length; start++, end++) {
        const patch = input.substring(start, end);
        // console.log(start, end, patch);

        if (new Set(patch.split('')).size === length) {
            return end;
        }
    }

    return -1;
}

examples4.forEach(e => {
    console.log('Example (4)', indexOfUniquePatch(e, 4));
});

console.log('Input (4)', indexOfUniquePatch(input, 4));

examples14.forEach(e => {
    console.log('Example (14)', indexOfUniquePatch(e, 14));
});

console.log('Input (14)', indexOfUniquePatch(input, 14));

console.log('End');
