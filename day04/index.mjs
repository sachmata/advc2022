import { once } from "node:events";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

import _ from "lodash";

(async function main() {
    console.log("Day 4");

    let result1 = 0;
    let result2 = 0;

    try {
        const rl = createInterface({
            input: createReadStream("./input.txt", { encoding: "utf8" }),
            crlfDelay: Infinity,
        });

        rl.on("line", (line) => {
            const [a, b] = line.split(",");
            const [aFrom, aTo] = a.split("-").map(Number);
            const [bFrom, bTo] = b.split("-").map(Number);

            const aRange = _.range(aFrom, aTo + 1);
            const bRange = _.range(bFrom, bTo + 1);

            const int = _.intersection(aRange, bRange);

            if (int.length === aRange.length || int.length === bRange.length) {
                result1++;
            }

            // part two

            if (int.length > 0) {
                result2++;
            }
        });

        await once(rl, "close");
    } catch (err) {
        console.error(err);
        return;
    }

    console.log("Sum part one", result1);

    console.log("Part two");

    console.log("Sum part two", result2);

    console.log("End");
})();
