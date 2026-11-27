"use client";

import { Howl } from "howler";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { PublicPreview } from "@/content/signature";
import type { Release } from "@/content/music-types";
import { advanceOrder, moveBack, nextRepeatMode, reorderUpcoming, startOrder, type PlaybackOrder, type RepeatMode } from "./playback-queue";

export interface PlayerRelease {
  slug: string;
  title: string;
  artwork: string;
  href: string;
  streamingLinks: Release["streamingLinks"];
}

export interface QueueTrack extends PublicPreview {
  release: PlayerRelease;
}

type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "unavailable" | "error";

type Player = ReturnType<typeof usePlayerState>;
const PlayerContext = createContext<Player | null>(null);

function usePlayerState(queue: readonly QueueTrack[], initialRelease: PlayerRelease | null) {
  const [release, setRelease] = useState(initialRelease);
  const [track, setTrack] = useState<QueueTrack>();
  const [status, setStatus] = useState<PlaybackStatus>(
    initialRelease && !queue.some((item) => item.release.slug === initialRelease.slug) ? "unavailable" : "idle",
  );
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [shuffle, setShuffle] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const sound = useRef<Howl | null>(null);
  const active = useRef<QueueTrack | undefined>(undefined);
  const options = useRef({ volume: 0.8, repeat: "off" as RepeatMode, shuffle: false });
  const pending = useRef(false);
  const order = useRef<PlaybackOrder | undefined>(undefined);
  const [playbackOrder, setPlaybackOrder] = useState<PlaybackOrder>();
  const opener = useRef<HTMLButtonElement | null>(null);
  const ids = queue.map((item) => item.id);
  const selected = release ? queue.find((item) => item.release.slug === release.slug) : queue[0];

  function updateOrder(next?: PlaybackOrder) {
    order.current = next;
    setPlaybackOrder(next);
  }

  const resetSound = useCallback(() => {
    const previous = sound.current;
    sound.current = null;
    active.current = undefined;
    pending.current = false;
    previous?.unload();
  }, []);

  useEffect(() => resetSound, [resetSound]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => {
      const position = sound.current?.seek();
      if (typeof position === "number") setElapsed(position);
    }, 100);
    return () => window.clearInterval(timer);
  }, [status]);

  function play(item: QueueTrack) {
    resetSound();
    active.current = item;
    setTrack(item);
    setRelease(item.release);
    setElapsed(0);
    setDuration(item.duration ?? 0);
    setStatus("loading");
    const engine = new Howl({
      src: [item.src],
      html5: true,
      preload: false,
      volume: options.current.volume,
      onload: () => {
        if (sound.current === engine) setDuration(engine.duration());
      },
      onplay: () => {
        if (sound.current !== engine) return;
        pending.current = false;
        setStatus("playing");
      },
      onpause: () => {
        if (sound.current === engine && !pending.current) setStatus("paused");
      },
      onend: () => {
        if (sound.current !== engine) return;
        const current = order.current;
        const { repeat, shuffle } = options.current;
        const next = current && advanceOrder(current, ids, repeat, shuffle, "ended");
        if (next && next === current) {
          engine.seek(0);
          setElapsed(0);
          engine.play();
          return;
        }
        if (next) playOrder(next);
        else {
          setElapsed(0);
          setStatus("paused");
        }
      },
      onloaderror: fail,
      onplayerror: fail,
    });

    function fail() {
      if (sound.current !== engine) return;
      pending.current = false;
      setStatus("error");
    }

    sound.current = engine;
    pending.current = true;
    engine.load().play();
  }

  function playOrder(next: PlaybackOrder | undefined) {
    if (!next) return;
    const item = queue.find(({ id }) => id === next.current);
    if (!item) return;
    updateOrder(next);
    play(item);
  }

  function openRoom(trigger: HTMLButtonElement, selection?: PlayerRelease) {
    opener.current = trigger;
    if (selection && selection.slug !== release?.slug) {
      resetSound();
      updateOrder();
      setRelease(selection);
      setTrack(undefined);
      setElapsed(0);
      setDuration(0);
      setStatus(queue.some((item) => item.release.slug === selection.slug) ? "idle" : "unavailable");
    }
    setExpanded(true);
  }

  function restoreRoomFocus() {
    const trigger = opener.current;
    opener.current = null;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  }

  function toggle() {
    const engine = sound.current;
    if (pending.current && engine) {
      resetSound();
      setElapsed(0);
      setDuration(0);
      setStatus("paused");
      return;
    }
    if (engine?.playing()) {
      engine.pause();
      setStatus("paused");
      return;
    }
    if (engine && status !== "error") {
      pending.current = true;
      setStatus("loading");
      engine.play();
      return;
    }
    const item = active.current ?? track ?? selected;
    if (item) playOrder(order.current ?? startOrder(ids, item.id, options.current.shuffle));
  }

  function step(direction: -1 | 1) {
    const current = order.current;
    if (!current) return;
    const { repeat, shuffle } = options.current;
    const next = direction === -1 ? moveBack(current) : advanceOrder(current, ids, repeat, shuffle, "next");
    if (next) playOrder(next);
  }

  function seek(value: number) {
    const engine = sound.current;
    if (engine?.state() !== "loaded") return;
    const seconds = Math.max(0, Math.min(value, engine.duration()));
    engine.seek(seconds);
    setElapsed(seconds);
  }

  function changeVolume(value: number) {
    options.current.volume = value;
    sound.current?.volume(value);
    setVolume(value);
  }

  return {
    release, track, status, elapsed, duration, volume, repeat, shuffle, expanded,
    playable: Boolean(selected),
    canSeek: duration > 0 && (status === "playing" || status === "paused"),
    canGoBack: Boolean(playbackOrder?.previous.length),
    canGoNext: Boolean(playbackOrder && (playbackOrder.upcoming.length || (repeat === "all" && queue.length > 1))),
    upcoming: playbackOrder?.upcoming.flatMap((id) => queue.filter((item) => item.id === id)) ?? [],
    queueLength: queue.length, openRoom, closeRoom: () => setExpanded(false), toggle, step, seek, changeVolume,
    restoreRoomFocus,
    toggleRepeat: () => {
      options.current.repeat = nextRepeatMode(options.current.repeat);
      setRepeat(options.current.repeat);
    },
    toggleShuffle: () => {
      options.current.shuffle = !options.current.shuffle;
      setShuffle(options.current.shuffle);
      if (order.current) updateOrder(reorderUpcoming(order.current, ids, options.current.shuffle));
    },
  };
}

export function PlayerProvider({ children, queue, initialRelease }: {
  children: ReactNode; queue: readonly QueueTrack[]; initialRelease: PlayerRelease | null;
}) {
  const player = usePlayerState(queue, initialRelease);
  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const player = useContext(PlayerContext);
  if (!player) throw new Error("Player controls require PlayerProvider");
  return player;
}
