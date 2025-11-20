import { Observable } from "rxjs";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

export class ExampleLoader {
  private cache: Record<string, GLTF> = {};
  private gltfLoader: GLTFLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  load(id: string, path: string): Observable<GLTF | null> {
    return new Observable<GLTF | null>((sub) => {
      if (this.cache[id]) {
        sub.next(this.cache[id]);
        return;
      }

      this.gltfLoader.load(
        path,
        (data: GLTF) => {
          this.cache[id] = data;
          sub.next(data);
        },
        () => {},
        (err: unknown) => {
          sub.error(err);
        }
      );
    });
  }
}