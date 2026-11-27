"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Headphones, Maximize, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type WaveSurfer from "wavesurfer.js";
import { StreamingLinks } from "@/features/releases/release-card";
import { usePlayer, type PlayerRelease } from "./player-provider";

const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function ListenButton({ release, label }: { release: PlayerRelease; label: string }) {
  const { openRoom } = usePlayer();
  return <button className="solid-button" onClick={(event) => openRoom(event.currentTarget, release)} type="button" aria-haspopup="dialog">
    <Headphones size={18} aria-hidden="true" /> {label}
  </button>;
}

function Transport() {
  const player = usePlayer();
  const playing = player.status === "playing";
  const loading = player.status === "loading";
  return <div className="transport">
    <button className="icon-button" type="button" aria-label="Previous preview"
      disabled={!player.canGoBack} onClick={() => player.step(-1)}><SkipBack /></button>
    <button className="icon-button transport-play" type="button"
      aria-label={playing ? "Pause preview" : loading ? "Cancel loading" : "Play preview"}
      disabled={!player.playable} onClick={player.toggle}>{playing || loading ? <Pause /> : <Play />}</button>
    <button className="icon-button" type="button" aria-label="Next preview"
      disabled={!player.canGoNext} onClick={() => player.step(1)}><SkipForward /></button>
  </div>;
}

function SeekControl() {
  const { track, duration, elapsed, seek, playable, canSeek, status } = usePlayer();
  const waveform = useRef<HTMLDivElement>(null);
  const renderer = useRef<WaveSurfer | null>(null);
  const peaks = track?.peaks;
  const waveformDuration = track?.duration ?? duration;
  const hasTimeline = playable && status !== "error" && status !== "loading";

  useEffect(() => {
    const container = waveform.current;
    if (!hasTimeline || !container || !peaks?.length || !waveformDuration) return;
    let disposed = false;
    void import("wavesurfer.js").then(({ default: WaveSurfer }) => {
      if (disposed) return;
      renderer.current = WaveSurfer.create({
        container, peaks: [Float32Array.from(peaks)], duration: waveformDuration,
        interact: false, waveColor: "#80757a", progressColor: "#f0bcaa", barWidth: 2,
        barGap: 2, height: 26, cursorWidth: 0,
      });
    }).catch(() => { /* The native seek control remains available. */ });
    return () => {
      disposed = true;
      renderer.current?.destroy();
      renderer.current = null;
    };
  }, [hasTimeline, peaks, waveformDuration]);

  useEffect(() => {
    const view = renderer.current;
    if (view?.getDuration()) view.setTime(elapsed);
  }, [elapsed]);

  if (!hasTimeline) {
    const message = status === "error" ? "Preview failed to load" :
      status === "loading" ? "Loading preview…" : "Preview unavailable";
    return <p className="preview-status" role="status">{message}</p>;
  }

  return <div className="seek">
    {peaks && <div ref={waveform} aria-hidden="true" />}
    <input type="range" min={0} max={duration || 1} step={0.1} value={elapsed}
      aria-label="Seek preview" aria-valuetext={`${time(elapsed)} of ${time(duration)}`}
      disabled={!canSeek} onChange={(event) => seek(event.currentTarget.valueAsNumber)} />
    <div className="time-display eyebrow"><span>{time(elapsed)}</span><span>{duration ? time(duration) : "–:––"}</span></div>
  </div>;
}

function Volume() {
  const player = usePlayer();
  return <label className="volume"><Volume2 aria-hidden="true" /><span className="sr-only">Volume</span>
    <input type="range" min={0} max={1} step={0.01} value={player.volume} disabled={!player.playable}
      onChange={(event) => player.changeVolume(event.currentTarget.valueAsNumber)} />
  </label>;
}

export function PlayerDock() {
  const { release, track, playable, openRoom } = usePlayer();
  if (!playable) return null;
  return <aside className="player-dock" aria-label="Persistent music player"
    data-preview="available">
    <button type="button" className="player-identity" onClick={(event) => openRoom(event.currentTarget)}
      aria-label="Open listening room" aria-haspopup="dialog">
      {release && <Image src={release.artwork} alt="" width={60} height={60} sizes="60px" />}
      <span><strong>{track?.title ?? release?.title ?? "Listening room"}</strong>
        <small>Narçi</small></span>
    </button>
    {playable && <>
      <Transport />
      <div className="dock-seek"><SeekControl /></div>
      <div className="dock-volume"><Volume /></div>
    </>}
    <button className="icon-button dock-open" type="button" aria-label="Expand listening room" aria-haspopup="dialog"
      onClick={(event) => openRoom(event.currentTarget)}>
      <Maximize aria-hidden="true" />
    </button>
  </aside>;
}

export function ListeningRoom() {
  const player = usePlayer();
  const reducedMotion = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { expanded, release, track } = player;
  const repeatLabel = { off: "Off", all: "All previews", one: "One preview" }[player.repeat];

  useEffect(() => {
    const element = dialog.current;
    if (expanded && element && !element.open) {
      element.showModal();
      closeButton.current?.focus({ preventScroll: true });
    }
    if (!expanded && element?.open) element.close();
  }, [expanded]);

  return <dialog className="listening-room" data-preview={player.playable ? "available" : "unavailable"} ref={dialog} aria-labelledby="listen-title" onClose={() => {
    player.closeRoom();
    player.restoreRoomFocus();
  }}>
    {expanded && <motion.div className="listening-inner grain"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.24 }}>
      <header><span className="wordmark">Narçi</span>
        <button ref={closeButton} className="icon-button" aria-label="Close listening room" type="button"
          onClick={() => dialog.current?.close()}><X /></button>
      </header>
      <p className="eyebrow era-label">Listening room</p>
      <div className="listening-grid">
        {release && <Image className="listening-art" src={release.artwork} alt={`${release.title} artwork`}
          width={520} height={520} sizes="(max-width: 700px) 88vw, 42vw" />}
        <div className="listening-copy">
          <h2 id="listen-title">{track?.title ?? release?.title ?? "Listening room"}</h2>
          <p>Narçi</p>
          {player.playable && <SeekControl />}
          {player.playable && <div className="room-controls">
            <Transport />
            <Volume />
          </div>}
          {!player.playable && release && <StreamingLinks release={release} />}
          {player.playable && <div className="queue-options">
            <button className="icon-button" type="button" aria-label={`Repeat mode: ${repeatLabel}`}
              data-active={player.repeat !== "off"}
              onClick={player.toggleRepeat}>{player.repeat === "one" ? <Repeat1 /> : <Repeat />}</button>
            <span className="sr-only" role="status">Repeat mode: {repeatLabel}</span>
            {player.queueLength > 1 && <button className="icon-button" type="button" aria-label="Shuffle previews"
              aria-pressed={player.shuffle} onClick={player.toggleShuffle}><Shuffle /></button>}
          </div>}
          {player.queueLength > 1 && player.upcoming.length > 0 && <section className="up-next" aria-labelledby="up-next-title">
            <h3 className="eyebrow" id="up-next-title">Up Next</h3>
            <ol>{player.upcoming.map((item, index) => <li key={`${item.id}-${index}`}>{item.title}</li>)}</ol>
          </section>}
          {release && <Link href={release.href} className="text-link" onClick={player.closeRoom}>Release and streaming links</Link>}
        </div>
      </div>
    </motion.div>}
  </dialog>;
}
