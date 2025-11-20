import { BaseAnimationValue } from "./base-animation-value";

export class SineValue extends BaseAnimationValue {
  private _min: number;
  private _max: number;

  constructor(time: number, speedPerSecond: number = 1, min: number, max: number) {
    super(time, speedPerSecond);
    this._min = min;
    this._max = max;
  }

  get value(): number {
    const difference = this._max - this._min;
    const median = difference / 2;
    const x = this.time;
    const v = (median * Math.sin(x * this.speed)) + this._min + median;

    return v;
  }
}