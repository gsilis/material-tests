import { BaseAnimationValue } from "./base-animation-value";

export class LinearValue extends BaseAnimationValue {
  constructor(time: number, speedPerSecond: number = 1) {
    super(time, speedPerSecond);
  }

  get value(): number {
    return this.diff * this.speedMs;
  }
}