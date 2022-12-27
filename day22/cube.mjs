const SIDE = 10;

// prettier-ignore
const LAYOUT_A = [
    [  null,   null, [4, 0],   null],
    [[0, 3], [1, 3], [2, 2], [3, 2]],
    [  null,   null, [5, 3],   null],
];

// prettier-ignore
const LAYOUT_B = [
    [  null, [0, 3], [1, 3]],
    [  null, [5, 0],   null],
    [[3, 0], [2, 0],   null],
    [[4, 0],   null,   null],
];

const DIR = { R: 0, D: 1, L: 2, U: 3 };

// prettier-ignore
const DELTA = [
    { R: [ 1, 0, 0], D: [ 0,-1, 0], L: [-1, 0, 0], U: [ 0, 1, 0] }, // face 0, z 0
    { R: [ 0, 1, 0], D: [ 0, 0,-1], L: [ 0,-1, 0], U: [ 0, 0, 1] }, // face 1, x M
    { R: [ 0, 1, 0], D: [-1, 0, 0], L: [ 0,-1, 0], U: [ 1, 0, 0] }, // face 2, z M
    { R: [ 0, 1, 0], D: [ 0, 0,-1], L: [ 0,-1, 0], U: [ 0, 0, 1] }, // face 3, x 0
    { R: [ 0, 0, 1], D: [-1, 0, 0], L: [ 0, 0,-1], U: [ 1, 0, 0] }, // face 4, y M
    { R: [ 1, 0, 0], D: [ 0, 0,-1], L: [-1, 0, 0], U: [ 0, 0, 1] }, // face 5, y 0
];

function cwRotate(x, y, side, steps) {
    steps = steps % 4;
    if (!steps) return [x, y];

    const offset = side / 2;
    x -= offset;
    y -= offset;

    switch (steps) {
        case 1: // 90 deg
            [x, y] = [y, -x];
            break;
        case 2: // 180 deg
            [x, y] = [-x, -y];
            break;
        case 3: // 270 deg
            [x, y] = [-y, x];
            break;
    }

    x += offset;
    y += offset;

    return [x, y];
}

export default function walkStep(posX, posY, direction, side, layout) {
    const row = Math.floor(posY / side);
    const col = Math.floor(posX / side);

    const sX = posX % side;
    const sY = posY % side;

    const face = layout[row]?.[col] ?? null;
    if (!face) {
        throw new Error('? Face ?');
    }

    let _posX = posX;
    let _posY = posY;

    // rotate
    let rot = face[1];
    while (rot--) {
        const a = _posX - side / 2;
        const b = _posY - side / 2;
    }

    return [posX, posY, direction];
}
