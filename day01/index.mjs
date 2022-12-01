import { once } from "node:events";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

(async function main() {
    console.log("Day 1");

    const elves = [0];

    try {
        const rl = createInterface({
            input: createReadStream("./input.txt", { encoding: "utf8" }),
            crlfDelay: Infinity,
        });

        rl.on("line", (line) => {
            if (line.length) {
                const mealCalories = Number(line);
                if (Number.isNaN(mealCalories)) {
                    console.error("Unable to parse", line);
                    return;
                }

                elves[elves.length - 1] += mealCalories;
            } else {
                elves.push(0);
            }
        });

        await once(rl, "close");
    } catch (err) {
        console.error(err);
        return;
    }

    let maxIndex = 0;

    for (let i = 0; i < elves.length; i++) {
        if (elves[i] > elves[maxIndex]) {
            maxIndex = i;
        }
    }

    console.log("Max", maxIndex, elves[maxIndex]);

    console.log("Part two");

    const sortElves = Array.from(elves.entries()).sort((a, b) => {
        return b[1] - a[1];
    });

    const top3Elves = sortElves.slice(0, 3);

    console.log("Top 3", top3Elves);

    const sumTop3 = top3Elves.reduce((acc, elf) => {
        return acc + elf[1];
    }, 0);

    console.log("Top 3 sum", sumTop3);

    console.log("End");
})();
