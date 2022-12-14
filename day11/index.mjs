import { fromFile } from '../lib/readlines.mjs';

console.log('Day 11');

function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function parse(file) {
    const _monkeys = [];
    let _lcm = 1;

    for (let line of fromFile(file)) {
        if (!line.length) {
            continue;
        }

        if (line.startsWith('Monkey')) {
            _monkeys.push({ inspected: 0 });
            continue;
        }

        const m = _monkeys.at(-1);

        if (line.startsWith('  Starting items:')) {
            m.items = line.substring(18).split(',').map(Number);
            continue;
        }

        if (line.startsWith('  Operation:')) {
            const [o, v] = line.substring(23).split(' ');
            const _v = +v;

            if (o === '+') {
                if (!Number.isNaN(_v)) {
                    m.operation = i => i + _v;
                } else {
                    m.operation = i => i + i;
                }
            } else if (o === '*') {
                if (!Number.isNaN(_v)) {
                    m.operation = i => i * _v;
                } else {
                    m.operation = i => i * i;
                }
            } else {
                throw new Error(`Unknown monkey operation '${o}'`);
            }

            continue;
        }

        if (line.startsWith('  Test:')) {
            m.div = +line.substring(21);
            _lcm = lcm(_lcm, m.div);
            continue;
        }

        if (line.startsWith('    If true:')) {
            m.destA = +line.substring(29);
            continue;
        }

        if (line.startsWith('    If false:')) {
            m.destB = +line.substring(30);
            continue;
        }
    }

    return { monkeys: _monkeys, lcm: _lcm };
}

const _file = './day11/input.txt';

const _data1 = parse(_file);

for (let round = 1; round <= 20; round++) {
    for (let monkey of _data1.monkeys) {
        while (monkey.items.length) {
            const item = monkey.items.shift();
            monkey.inspected++;

            let worry = monkey.operation(item);
            worry = Math.floor(worry / 3);

            const dest = !(worry % monkey.div) ? monkey.destA : monkey.destB;
            _data1.monkeys[dest].items.push(worry);
        }
    }

    // console.log(
    //     round,
    //     _data1.monkeys.map(m => m.inspected)
    // );
}

const [a1, b1] = _data1.monkeys.sort((a, b) => b.inspected - a.inspected);
console.log('Monkey business', a1.inspected * b1.inspected); // 69918

console.log('Part two');

const _data2 = parse(_file);

for (let round = 1; round <= 10000; round++) {
    for (let monkey of _data2.monkeys) {
        while (monkey.items.length) {
            const item = monkey.items.shift();
            monkey.inspected++;

            let worry = monkey.operation(item);
            worry = worry % _data2.lcm;

            const dest = !(worry % monkey.div) ? monkey.destA : monkey.destB;
            _data2.monkeys[dest].items.push(worry);
        }
    }

    // if (!(round % 1000)) {
    //     console.log(
    //         round,
    //         _data2.monkeys.map(m => m.inspected)
    //     );
    // }
}

const [a2, b2] = _data2.monkeys.sort((a, b) => b.inspected - a.inspected);
console.log('Monkey business', a2.inspected * b2.inspected); // 19573408701

console.log('End');
