export type RepeatMode = "off" | "all" | "one";

export interface PlaybackOrder {
  current: string;
  previous: readonly string[];
  upcoming: readonly string[];
}

export function nextRepeatMode(mode: RepeatMode): RepeatMode {
  return mode === "off" ? "all" : mode === "all" ? "one" : "off";
}

function shuffled(ids: readonly string[], random: () => number) {
  const result = [...ids];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function startOrder(ids: readonly string[], current: string | undefined, shuffle: boolean, random = Math.random): PlaybackOrder | undefined {
  if (current === undefined || !ids.includes(current)) return;
  return {
    current,
    previous: [],
    upcoming: shuffle ? shuffled(ids.filter((id) => id !== current), random) : ids.slice(ids.indexOf(current) + 1),
  };
}

export function reorderUpcoming(order: PlaybackOrder, ids: readonly string[], shuffle: boolean, random = Math.random): PlaybackOrder {
  const remaining = new Set(order.upcoming);
  return {
    ...order,
    upcoming: shuffle ? shuffled(order.upcoming, random) : ids.filter((id) => remaining.has(id)),
  };
}

export function moveBack(order: PlaybackOrder): PlaybackOrder | undefined {
  const current = order.previous[order.previous.length - 1];
  if (current === undefined) return;
  return {
    current,
    previous: order.previous.slice(0, -1),
    upcoming: [order.current, ...order.upcoming],
  };
}

export function advanceOrder(
  order: PlaybackOrder, ids: readonly string[], repeat: RepeatMode, shuffle: boolean,
  reason: "ended" | "next", random = Math.random,
): PlaybackOrder | undefined {
  if (reason === "ended" && repeat === "one") return order;

  let upcoming = order.upcoming;
  if (!upcoming.length && repeat === "all" && (ids.length > 1 || reason === "ended")) {
    const cycle = shuffle ? shuffled(ids, random) : [...ids];
    // A new pass should move on even if its first preview just finished.
    upcoming = cycle.length > 1 && cycle[0] === order.current
      ? [...cycle.slice(1), cycle[0]]
      : cycle;
  }

  const [current, ...rest] = upcoming;
  if (current === undefined) return;
  if (current === order.current) return order;
  return { current, previous: [...order.previous, order.current], upcoming: rest };
}
