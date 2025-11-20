import { BehaviorSubject } from "rxjs";
import { Font, FontLoader } from "three/examples/jsm/Addons.js";

export class FontManager {
  fonts: Record<string, BehaviorSubject<Font | null>> = {};
  loader: FontLoader;

  constructor() {
    this.loader = new FontLoader();
  }

  fontFor(path: string): BehaviorSubject<Font | null> {
    const existingSubject = this.fonts[path];
    if (existingSubject) return existingSubject;

    const newSubject = new BehaviorSubject<Font | null>(null);
    this.loader.load(
      path,
      (data: Font) => {
        newSubject.next(data);
      },
      () => {},
      (_err: unknown) => {
        newSubject.error(`Could not load font '${path}'`);
      }
    );
    return newSubject;
  }
}