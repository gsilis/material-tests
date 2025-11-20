import type { AnimationValue } from "../interfaces/animation-value";

export abstract class BaseAnimationValue implements AnimationValue {
  static ONE_MS = 1 / 1000;
  static ONE_RADIAN = Math.PI / 180;

  private _time: number;
  private _diff: number = 0;
  private _speed: number;

  constructor(time: number, speedPerSecond: number = 1) {
    this._time = time;
    this._speed = speedPerSecond / 1000;
  }

  get speed(): number {
    return this._speed * 1000;
  }

  set speed(newSpeed: number) {
    this._speed = newSpeed / 1000;
  }

  get speedMs(): number {
    return this._speed;
  }

  get diff(): number {
    return this._diff;
  }

  get time(): number {
    return this._time;
  }

  advance(newTime: number) {
    this._diff = newTime - this._time;
    this._time = newTime;
  }

  abstract get value(): number;
}