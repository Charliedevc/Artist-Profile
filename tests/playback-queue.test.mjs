import assert from "node:assert/strict";
import { test } from "node:test";
import {
  advanceOrder, moveBack, nextRepeatMode, reorderUpcoming, startOrder,
} from "../.npm-cache/test-output/playback-queue.js";

const ids = ["a", "b", "c", "d"];
const random = () => 0;

test("an empty catalog has no playback order", () => {
  const empty = [];
  assert.equal(startOrder(empty, empty[0], false), undefined);
});

test("Off stops at the end and Previous retraces the actual order", () => {
  const first = startOrder(ids, "c", false);
  assert.equal(moveBack(first), undefined);
  const last = advanceOrder(first, ids, "off", false, "next");
  assert.equal(last.current, "d");
  assert.equal(advanceOrder(last, ids, "off", false, "ended"), undefined);
  assert.equal(advanceOrder(last, ids, "off", false, "next"), undefined);
  assert.deepEqual(moveBack(last), first);
});

test("shuffle fixes the pass order and Previous restores that order", () => {
  const first = startOrder(ids, "c", true, random);
  assert.deepEqual(first.upcoming, ["b", "d", "a"]);
  let order = first;
  const played = [order.current];
  while (order.upcoming.length) {
    const next = advanceOrder(order, ids, "off", true, "ended", () => {
      throw new Error("random must only be used when building a pass");
    });
    assert.deepEqual(moveBack(next), order);
    played.push(next.current);
    order = next;
  }
  assert.deepEqual(played, ["c", "b", "d", "a"]);
  assert.equal(advanceOrder(order, ids, "off", true, "ended"), undefined);
});

test("switching shuffle reorders only remaining previews and keeps history", () => {
  const first = startOrder(ids, "a", false);
  const second = advanceOrder(first, ids, "off", false, "next");
  const shuffled = reorderUpcoming(second, ids, true, random);
  assert.deepEqual(shuffled, { current: "b", previous: ["a"], upcoming: ["d", "c"] });
  assert.deepEqual(reorderUpcoming(shuffled, ids, false), second);
});

test("All wraps, including a new shuffle pass without an immediate duplicate", () => {
  const last = startOrder(ids, "d", false);
  assert.equal(advanceOrder(last, ids, "all", false, "ended").current, "a");
  const shuffleLast = { ...last, current: "b" };
  const next = advanceOrder(shuffleLast, ids, "all", true, "ended", random);
  assert.notEqual(next.current, shuffleLast.current);
  assert.deepEqual([next.current, ...next.upcoming].sort(), ids);
  const switchedOff = { ...last, current: "a" };
  const afterSwitch = advanceOrder(switchedOff, ids, "all", false, "ended");
  assert.deepEqual([afterSwitch.current, ...afterSwitch.upcoming], ["b", "c", "d", "a"]);
});

test("repeat modes cycle and One applies to natural endings only", () => {
  assert.equal(nextRepeatMode("off"), "all");
  assert.equal(nextRepeatMode("all"), "one");
  assert.equal(nextRepeatMode("one"), "off");
  const first = startOrder(ids, "a", false);
  assert.equal(advanceOrder(first, ids, "one", false, "ended"), first);
  assert.equal(advanceOrder(first, ids, "one", false, "next").current, "b");
});

test("one preview can repeat without enabling skip buttons", () => {
  const single = ["a"];
  const order = startOrder(single, "a", true);
  assert.equal(moveBack(order), undefined);
  assert.equal(advanceOrder(order, single, "off", true, "ended"), undefined);
  assert.equal(advanceOrder(order, single, "all", true, "ended"), order);
  assert.equal(advanceOrder(order, single, "one", true, "ended"), order);
  assert.equal(advanceOrder(order, single, "all", true, "next"), undefined);
});
