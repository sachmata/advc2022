import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 20');

// https://adventofcode.com/2022/day/XX/input

let LINES = 0;

class Node {
    v;
    next;
    prev;

    constructor(v) {
        this.v = v;
    }

    shift() {
        let _prev;
        let _next;

        if (!this.v) {
            return;
        }

        if (this.v > 0) {
            _prev = this;
            let _v = this.v % (LINES - 1);
            while (_v--) {
                _prev = _prev.next;
            }
            _next = _prev.next;
        }

        if (this.v < 0) {
            _next = this;
            let _v = this.v % (LINES - 1);
            while (_v++) {
                _next = _next.prev;
            }
            _prev = _next.prev;
        }

        this.prev.next = this.next;
        this.next.prev = this.prev;

        _prev.next = this;
        this.prev = _prev;
        this.next = _next;
        _next.prev = this;
    }
}

const nodes = [];
let node0;

const SECRET = 811589153;

for (let line of fromFile('./day20/input.txt')) {
    if (!line.length) {
        continue;
    }

    const node = new Node(+line * SECRET);
    if (!node.v) {
        node0 = node;
    }

    nodes.push(node);
}

LINES = nodes.length;

for (let i = 0; i < nodes.length; i++) {
    const node = nodes.at(i);
    node.prev = nodes.at(i - 1);
    node.next = nodes.at((i + 1) % nodes.length);
}

for (let u = 0; u < 10; u++) {
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].shift();
    }
}

let sum = 0;

let current = node0;
for (let i = 1; i <= 3000; i++) {
    current = current.next;
    if (!(i % 1000)) {
        sum += current.v;
    }
}

console.log(sum); // 3300733085251 // 6640

console.log('End');
