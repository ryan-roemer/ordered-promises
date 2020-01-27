"use strict";

/**
 * Run slow promises with a max concurrency in guaranteed order while only
 * draining
 */
const pLimit = require("p-limit");

console.log("TODO HERE", require.resolve);
console.log("TODO HERE", process.env);
console.log("TODO HERE", require.resolve("p-limit"));

// Constants.
const NUM_CONCURRENCY = 4;
const NUM_PROMS = 20;
const MAX_MS = 1000;

// Helpers
const limit = pLimit(NUM_CONCURRENCY);
const getRandomInt = () => Math.floor(Math.random() * (MAX_MS + 1));

// This is a slow task that we want max parallelism on. It should be limited
// in concurrency.
const slowTask = (num) => new Promise((resolve) => {
  const time = getRandomInt();
  setTimeout(() => resolve({ num, time }), time);
});

// This task is fast, but must be run **in original promise order** and we
// want it to run _as soon as possible_, not waiting for all promises to
// resolve.
const finishTask = (obj) => console.log(obj);

const main = async () => {
  // The normal approach that doesn't guarantee `finishTask` order.
  console.log("\nLimited, unordered");
  const unorderedProms = (new Array(NUM_PROMS)).fill(0).map((_, num) =>
    limit(() => slowTask(num).then(finishTask)));

  await Promise.all(unorderedProms);

  // Guarantees `finishTask` ordered and limited, but all results stored.
  console.log("\nLimited, ordered, wait");
  const waitingProms = (new Array(NUM_PROMS)).fill(0).map((_, num) =>
    limit(() => slowTask(num)));

  await Promise.all(waitingProms).then((objs) => objs.map((o) => finishTask(o)));

  // Guarantees `finishTask` order while running at max concurrency.
  console.log("\nLimited, ordered, no-wait");
  const orderedProms = (new Array(NUM_PROMS)).fill(0).map((_, num) =>
    limit(() => slowTask(num)));

  // Await the promises in serial.
  for (let i = 0; i < NUM_PROMS; i++) {
    await orderedProms[i].then(finishTask);
  }
};

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

