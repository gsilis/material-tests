const oneMs = 1 / 1000;

export class Time {
  private _current: number;
  private _speed: number;
  private _speedPerMs: number;
  private _thisFrame: number = 0;

  constructor(startTime: number, speedPerSecond: number = 1) {
    this._current = startTime;
    this._speed = speedPerSecond;
    this._speedPerMs = speedPerSecond / 1000; 
  }

  advance(time?: number) {
    time = time || Date.now();
    const diff = time - this._current;
    this._current = time;

    this._thisFrame = diff * oneMs * this._speedPerMs;
  }

  get value(): number {
    return this._thisFrame;
  }
}