export interface ExampleScene {
  setup(): void;
  teardown(): void;
  render(time: number): void;
}