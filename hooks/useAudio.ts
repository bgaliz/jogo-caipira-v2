'use client';

import { useRef, useCallback } from 'react';

type SoundType = 'correct' | 'wrong' | 'victory' | 'fall' | 'click';

function createAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function synthesizeCorrect(ctx: AudioContext) {
  const t = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    playTone(ctx, freq, t + i * 0.12, 0.25, 'triangle', 0.4);
  });
}

function synthesizeWrong(ctx: AudioContext) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.6);
  gain.gain.setValueAtTime(0.35, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  osc.start(t);
  osc.stop(t + 0.6);
}

function synthesizeVictory(ctx: AudioContext) {
  const t = ctx.currentTime;
  const melody = [523, 523, 659, 523, 784, 740];
  const times = [0, 0.15, 0.3, 0.5, 0.65, 0.85];
  melody.forEach((freq, i) => {
    playTone(ctx, freq, t + times[i], 0.22, 'triangle', 0.5);
    playTone(ctx, freq * 1.5, t + times[i], 0.22, 'sine', 0.2);
  });
}

function synthesizeFall(ctx: AudioContext) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.9);
  gain.gain.setValueAtTime(0.4, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
  osc.start(t);
  osc.stop(t + 0.9);
}

function synthesizeClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  playTone(ctx, 400, t, 0.08, 'sine', 0.15);
}

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext();
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (sound: SoundType) => {
      const ctx = getCtx();
      if (!ctx) return;
      switch (sound) {
        case 'correct': synthesizeCorrect(ctx); break;
        case 'wrong': synthesizeWrong(ctx); break;
        case 'victory': synthesizeVictory(ctx); break;
        case 'fall': synthesizeFall(ctx); break;
        case 'click': synthesizeClick(ctx); break;
      }
    },
    [getCtx]
  );

  return { play };
}
