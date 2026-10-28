// The fun meter: 0 to cap, one value per player per session, carried across careers.
//
// Each tap moves it by three things, and only the first comes from the model:
//   model   the player's own reaction to this screen, -maxDelta..+maxDelta
//   repeat  a full card already seen this session: -5, then -10, then -15 if repeats come
//           close together (a streak that resets after three fresh cards in a row)
//   decay   a little off every tap
// Lines that pass by themselves ("Meanwhile") are not cards and never count. Neither do the
// engine's one-line years (ids starting "__") or the planted canaries, which are test
// instruments, not content. Ending screens are taps without a card: decay only.
import type { FunConfig } from "./config.ts";

export interface TapInput {
  card: string | null;   // the event id on this screen; null for an ending screen
  model: number;         // the model's delta (0 when no usable reply)
  canary?: boolean;
}
export interface Tap {
  before: number;
  model: number;
  repeat: number;        // 0 or negative
  decay: number;         // 0 or negative
  after: number;
  isRepeat: boolean;
  streak: number;        // repeats in the current streak, after this tap
  quit: boolean;         // at or below the quit line after this tap
}

export const isFullCard = (id: string | null, canary = false) => !!id && !id.startsWith("__") && !id.startsWith("canary_") && !canary;

export class Meter {
  readonly cfg: FunConfig;
  value: number;
  taps = 0;
  private seen = new Set<string>();
  private streak = 0;
  private fresh = 0;

  constructor(cfg: FunConfig) {
    this.cfg = cfg;
    this.value = cfg.start;
  }

  // What a repeat costs at a given streak length (1-based), scaled and rounded.
  repeatCost(streak: number): number {
    const steps = this.cfg.repeatSteps;
    return Math.round(steps[Math.min(streak, steps.length) - 1] * this.cfg.repeatMultiplier);
  }

  hasSeen(id: string) { return this.seen.has(id); }

  tap(t: TapInput): Tap {
    const c = this.cfg, before = this.value;
    const model = Math.max(-c.maxDelta, Math.min(c.maxDelta, Math.round(Number(t.model) || 0)));
    let repeat = 0, isRepeat = false;
    if (isFullCard(t.card, t.canary)) {
      if (this.seen.has(t.card!)) {
        isRepeat = true;
        this.streak++;
        this.fresh = 0;
        repeat = -this.repeatCost(this.streak);
      } else {
        this.seen.add(t.card!);
        if (++this.fresh >= c.freshToReset) this.streak = 0;
      }
    }
    const decay = -c.decay;
    const after = Math.max(0, Math.min(c.cap, before + model + repeat + decay));
    this.value = after;
    this.taps++;
    return { before, model, repeat, decay, after, isRepeat, streak: this.streak, quit: after <= c.quitLine };
  }
}
