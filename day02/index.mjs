import { once } from "node:events";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

(async function main() {
    console.log("Day 2");

    const roundsA = [];
    const roundsB = [];

    function gameA(call, response) {
        if (call === "A") {
            //rock
            if (response === "X") {
                //rock
                //draw
                roundsA.push(1 + 3);
                return;
            }
            if (response === "Y") {
                //paper
                //win
                roundsA.push(2 + 6);
                return;
            }
            if (response === "Z") {
                //scissors
                //lose
                roundsA.push(3 + 0);
                return;
            }
            return;
        }
        if (call === "B") {
            // paper
            if (response === "X") {
                //rock
                //lose
                roundsA.push(1 + 0);

                return;
            }
            if (response === "Y") {
                //paper
                //draw
                roundsA.push(2 + 3);
                return;
            }
            if (response === "Z") {
                //scissors
                //win
                roundsA.push(3 + 6);
                return;
            }
            return;
        }
        if (call == "C") {
            //scissors
            if (response === "X") {
                //rock
                //win
                roundsA.push(1 + 6);

                return;
            }
            if (response === "Y") {
                //paper
                //lose
                roundsA.push(2 + 0);
                return;
            }
            if (response === "Z") {
                //scissors
                //draw
                roundsA.push(3 + 3);
                return;
            }
            return;
        }
    }

    function gameB(call, outcome) {
        if (call === "A") {
            //rock
            if (outcome === "X") {
                //lose
                //scissors
                roundsB.push(3 + 0);
                return;
            }
            if (outcome === "Y") {
                //draw
                //rock
                roundsB.push(1 + 3);
                return;
            }
            if (outcome === "Z") {
                //win
                //paper
                roundsB.push(2 + 6);
                return;
            }
            return;
        }
        if (call === "B") {
            // paper
            if (outcome === "X") {
                //lose
                //rock
                roundsB.push(1 + 0);
                return;
            }
            if (outcome === "Y") {
                //draw
                //paper
                roundsB.push(2 + 3);
                return;
            }
            if (outcome === "Z") {
                //win
                //scissors
                roundsB.push(3 + 6);
                return;
            }
            return;
        }
        if (call == "C") {
            //scissors
            if (outcome === "X") {
                //lose
                //paper
                roundsB.push(2 + 0);
                return;
            }
            if (outcome === "Y") {
                //draw
                //scissors
                roundsB.push(3 + 3);
                return;
            }
            if (outcome === "Z") {
                //win
                //rock
                roundsB.push(1 + 6);
                return;
            }
            return;
        }
    }

    try {
        const rl = createInterface({
            input: createReadStream("./input.txt", { encoding: "utf8" }),
            crlfDelay: Infinity,
        });

        rl.on("line", (line) => {
            const [a, b] = line.split(" ");

            gameA(a, b);
            gameB(a, b);
        });

        await once(rl, "close");
    } catch (err) {
        console.error(err);
        return;
    }

    const sumA = roundsA.reduce((acc, r) => acc + r, 0);

    console.log("Sum A", sumA);
    console.log("Part two");

    const sumB = roundsB.reduce((acc, r) => acc + r, 0);
    console.log("Sum B", sumB);

    console.log("End");
})();
