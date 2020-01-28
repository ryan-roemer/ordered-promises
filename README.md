Promise Ordering
================

Simple experiments to try ordering promises.

## Scenario

We have an array of work to do in two parts:

1. `slowTask()`: A slow task
2. `finishTask()`: Something that deals with finished promises

Our constraints are:

- We want to process `slowTask()` work items in parallel, starting in order.
- Each of `finishTask()` must be run **in original array order**.
- We want to run `slowTask()` in parallel as much as possible. but within a `limit` concurrency constraint.
- We want each `finishTask()` that can run (is next in order) to run as soon as possible.
- As each `slowTask()` finishes, we want to run the next one as soon as possible.

## Experiment

We do three experiments:

- `Limited, unordered`: Run all in parallel. Does **not** guarantee order of `finishTask()`. Runs all tasks through a limit queue.
- `Limited, ordered, wait`: Run `slowTask()` in parallel, then wait on results and run `finishTask()` in order. Guarantees order, but does not start processing `finishTask()` as soon as possible.
- `Limited, ordered, no-wait`: Meets all constraints above.

## Sample run

Our `slowTask()` is just a random wait. Our `finishTask()` outputs the order index and wait time from `slowTask()`:

```sh
$ node index.js

Limited, unordered
{ num: 0, time: 253 }
{ num: 4, time: 64 }
{ num: 3, time: 690 }
{ num: 5, time: 366 }
{ num: 7, time: 64 }
{ num: 1, time: 949 }
{ num: 2, time: 962 }
{ num: 6, time: 445 }
{ num: 9, time: 365 }
{ num: 10, time: 374 }
{ num: 8, time: 634 }
{ num: 14, time: 59 }
{ num: 13, time: 584 }
{ num: 12, time: 652 }
{ num: 17, time: 75 }
{ num: 11, time: 965 }
{ num: 15, time: 704 }
{ num: 18, time: 282 }
{ num: 19, time: 463 }
{ num: 16, time: 696 }

Limited, ordered, wait
{ num: 0, time: 875 }
{ num: 1, time: 282 }
{ num: 2, time: 887 }
{ num: 3, time: 446 }
{ num: 4, time: 518 }
{ num: 5, time: 955 }
{ num: 6, time: 141 }
{ num: 7, time: 2 }
{ num: 8, time: 891 }
{ num: 9, time: 227 }
{ num: 10, time: 442 }
{ num: 11, time: 710 }
{ num: 12, time: 738 }
{ num: 13, time: 77 }
{ num: 14, time: 176 }
{ num: 15, time: 867 }
{ num: 16, time: 297 }
{ num: 17, time: 127 }
{ num: 18, time: 894 }
{ num: 19, time: 516 }

Limited, ordered, no-wait
{ num: 0, time: 826 }
{ num: 1, time: 725 }
{ num: 2, time: 598 }
{ num: 3, time: 624 }
{ num: 4, time: 580 }
{ num: 5, time: 811 }
{ num: 6, time: 48 }
{ num: 7, time: 902 }
{ num: 8, time: 887 }
{ num: 9, time: 802 }
{ num: 10, time: 298 }
{ num: 11, time: 696 }
{ num: 12, time: 438 }
{ num: 13, time: 19 }
{ num: 14, time: 704 }
{ num: 15, time: 770 }
{ num: 16, time: 929 }
{ num: 17, time: 704 }
{ num: 18, time: 477 }
{ num: 19, time: 789 }
```
