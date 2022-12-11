console.log('Day 11');

function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

const monkeys_example = () => [
    {
        items: [79, 98],
        operation: item => item * 19,
        test: item => (!(item % 23) ? 2 : 3),
        inspected: 0,
    },
    {
        items: [54, 65, 75, 74],
        operation: item => item + 6,
        test: item => (!(item % 19) ? 2 : 0),
        inspected: 0,
    },
    {
        items: [79, 60, 97],
        operation: item => item * item,
        test: item => (!(item % 13) ? 1 : 3),
        inspected: 0,
    },
    {
        items: [74],
        operation: item => item + 3,
        test: item => (!(item % 17) ? 0 : 1),
        inspected: 0,
    },
];

const lcm_example = [23, 19, 13, 17].reduce((acc, i) => lcm(acc, i), 1);

const monkeys_input = () => [
    {
        items: [74, 73, 57, 77, 74],
        operation: item => item * 11,
        test: item => (!(item % 19) ? 6 : 7),
        inspected: 0,
    },
    {
        items: [99, 77, 79],
        operation: item => item + 8,
        test: item => (!(item % 2) ? 6 : 0),
        inspected: 0,
    },
    {
        items: [64, 67, 50, 96, 89, 82, 82],
        operation: item => item + 1,
        test: item => (!(item % 3) ? 5 : 3),
        inspected: 0,
    },
    {
        items: [88],
        operation: item => item * 7,
        test: item => (!(item % 17) ? 5 : 4),
        inspected: 0,
    },
    {
        items: [80, 66, 98, 83, 70, 63, 57, 66],
        operation: item => item + 4,
        test: item => (!(item % 13) ? 0 : 1),
        inspected: 0,
    },
    {
        items: [81, 93, 90, 61, 62, 64],
        operation: item => item + 7,
        test: item => (!(item % 7) ? 1 : 4),
        inspected: 0,
    },
    {
        items: [69, 97, 88, 93],
        operation: item => item * item,
        test: item => (!(item % 5) ? 7 : 2),
        inspected: 0,
    },
    {
        items: [59, 80],
        operation: item => item + 6,
        test: item => (!(item % 11) ? 2 : 3),
        inspected: 0,
    },
];

const lcm_input = [19, 2, 3, 17, 13, 7, 5, 11].reduce((acc, i) => lcm(acc, i), 1);

// const _monkeys = monkeys_example();
const _monkeys1 = monkeys_input();

for (let round = 1; round <= 20; round++) {
    for (let monkey of _monkeys1) {
        while (monkey.items.length) {
            const item = monkey.items.shift();
            monkey.inspected++;

            let worry = monkey.operation(item);
            worry = Math.floor(worry / 3);

            _monkeys1[monkey.test(worry)].items.push(worry);
        }
    }

    // console.log(
    //     round,
    //     _monkeys.map(m => m.inspected)
    // );
}

const [a1, b1] = _monkeys1.sort((a, b) => b.inspected - a.inspected);
console.log('Monkey business', a1.inspected * b1.inspected);

console.log('Part two');

// reset
// _monkeys = monkeys_example();
const _monkeys2 = monkeys_input();

// const _lcm = lcm_example;
const _lcm = lcm_input;

for (let round = 1; round <= 10000; round++) {
    for (let monkey of _monkeys2) {
        while (monkey.items.length) {
            const item = monkey.items.shift();
            monkey.inspected++;

            let worry = monkey.operation(item);
            worry = worry % _lcm;

            _monkeys2[monkey.test(worry)].items.push(worry);
        }
    }

    // if (!(round % 1000)) {
    //     console.log(
    //         round,
    //         _monkeys.map(m => m.inspected)
    //     );
    // }
}

const [a2, b2] = _monkeys2.sort((a, b) => b.inspected - a.inspected);
console.log('Monkey business', a2.inspected * b2.inspected);

console.log('End');
