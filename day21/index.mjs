import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 21');

// https://adventofcode.com/2022/day/XX/input

class MathMonkey {
    left;
    right;
    operation;
    promise;
    resolve;

    constructor(name, left, operation, right) {
        this.name = name;
        this.left = left;
        this.operation = operation;
        this.right = right;

        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    async attach(monkeys) {
        const left = await monkeys[this.left].promise;
        const right = await monkeys[this.right].promise;

        let result = NaN;
        switch (this.operation) {
            case '+':
                result = left + right;
                break;
            case '-':
                result = left - right;
                break;
            case '*':
                result = left * right;
                break;
            case '/':
                result = left / right;
                break;
        }

        this.resolved = true;
        this.resolve(result);
    }

    async fix(value, monkeys) {
        if (this.resolved) {
            console.log('Unable to fix now !');
            return;
        }

        const [result, isLeft] = await Promise.race([
            monkeys[this.left].promise.then(r => [r, true]),
            monkeys[this.right].promise.then(r => [r, false]),
        ]);

        let fix = NaN;
        switch (this.operation) {
            case '+':
                fix = value - result;
                break;
            case '-':
                fix = isLeft ? result - value : result + value;
                break;
            case '*':
                fix = value / result;
                break;
            case '/':
                fix = isLeft ? result / value : result * value;
                break;
        }

        const toFix = isLeft ? this.right : this.left;
        monkeys[toFix].fix(fix, monkeys);
    }
}

class NumberMonkey {
    name;
    promise;

    constructor(name, value) {
        this.name = name;
        this.promise = Promise.resolve(value);
    }
}

class RootMonkey {
    left;
    right;
    promise;
    resolve;

    constructor(name, left, right) {
        this.name = name;
        this.left = left;
        this.right = right;

        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    async attach(monkeys) {
        const [result, isLeft] = await Promise.race([
            monkeys[this.left].promise.then(r => [r, true]),
            monkeys[this.right].promise.then(r => [r, false]),
        ]);

        const toFix = isLeft ? this.right : this.left;
        monkeys[toFix].fix(result, monkeys);

        const left = await monkeys[this.left].promise;
        const right = await monkeys[this.right].promise;

        this.resolve(left === right ? 'OK' : 'FAIL');
    }
}

class Human {
    name;
    promise;
    resolve;

    constructor(name) {
        this.name = name;

        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    async fix(value, monkeys) {
        if (this.resolved) {
            console.log('Unable to fix now !');
            return;
        }

        this.resolved = true;
        this.resolve(value);
    }
}

const _monkeys1 = {};

for (let line of fromFile('./day21/input.txt')) {
    if (!line.length) {
        continue;
    }

    const [name, data] = line.split(': ');

    if (!Number.isNaN(+data)) {
        _monkeys1[name] = new NumberMonkey(name, +data);
        continue;
    }

    let [left, operation, right] = data.split(' ');

    _monkeys1[name] = new MathMonkey(name, left, operation, right);
}

for (const name in _monkeys1) {
    _monkeys1[name].attach?.(_monkeys1);
}

const result = await _monkeys1.root.promise;
console.log(result); // 10037517593724

console.log('Part two');

const _monkeys2 = {};

for (let line of fromFile('./day21/input.txt')) {
    if (!line.length) {
        continue;
    }

    const [name, data] = line.split(': ');

    // part two
    if (name === 'humn') {
        _monkeys2[name] = new Human(name);
        continue;
    }

    if (!Number.isNaN(+data)) {
        _monkeys2[name] = new NumberMonkey(name, +data);
        continue;
    }

    let [left, operation, right] = data.split(' ');

    // part two
    if (name === 'root') {
        _monkeys2[name] = new RootMonkey(name, left, right);
        continue;
    }

    _monkeys2[name] = new MathMonkey(name, left, operation, right);
}

for (const name in _monkeys2) {
    _monkeys2[name].attach?.(_monkeys2);
}

// part two
const resultHuman = await _monkeys2.humn.promise;
const resultRoot = await _monkeys2.root.promise;
console.log(resultHuman, resultRoot); // 3272260914328 OK

console.log('End');
