// rotating cache as single map has about 16M limit size

export default class Cache {
    maps = [new Map()];

    constructor() {}

    set(key, value) {
        let map = this.maps[this.maps.length - 1];
        if (map.size > 10e6) {
            map = new Map();
            this.maps.push(map);
        }
        map.set(key, value);
    }

    get(key) {
        for (let map of this.maps) if (map.has(key)) return map.get(key);
        return undefined;
    }

    has(key) {
        for (let map of this.maps) if (map.has(key)) return true;
        return false;
    }

    reset() {
        this.maps = [new Map()];
    }
}
