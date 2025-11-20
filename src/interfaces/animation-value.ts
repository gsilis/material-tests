export interface AnimationValue {
  get speed(): number;
  set speed(newSpeed: number);
  get speedMs(): number;
  get value(): number;
  get diff(): number;

  advance(newTime: number): void;
}