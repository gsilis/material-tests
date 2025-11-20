import { HalfFloatType, PerspectiveCamera, Vector2, WebGLRenderer } from "three";
import type { Example } from "./examples";
import type { ExampleScene } from "./interfaces/example-scene";
import { DefaultScene } from "./default-scene";
import { FontManager } from "./core/font-manager";
import { ExampleLoader } from "./core/example-loader";
import { EffectComposer } from "postprocessing";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { ImportedScene } from "./imported-scene";
import { MouseWatcher } from "./core/mouse-watcher";
import { DimensionWatcher } from "./core/dimension-watcher";

export class Player {
  private camera: PerspectiveCamera;
  private dom?: HTMLElement;
  private renderer: WebGLRenderer;
  private scene?: ExampleScene;
  private fontManager: FontManager;
  private exampleLoader: ExampleLoader;
  private effectsComposer: EffectComposer;
  private dimensionsWatcher?: DimensionWatcher;
  private mouseWatcher?: MouseWatcher;

  constructor() {
    this.camera = new PerspectiveCamera(75, 1);
    this.camera.position.set(0, 0, 0);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.effectsComposer = new EffectComposer(this.renderer, { multisampling: 8, frameBufferType: HalfFloatType });
    this.fontManager = new FontManager();
    this.exampleLoader = new ExampleLoader();
  }

  attach(dom: HTMLDivElement) {
    this.dom = dom;
    this.dimensionsWatcher = new DimensionWatcher(this.dom);
    this.mouseWatcher = new MouseWatcher(this.camera, this.dom, this.dimensionsWatcher);

    this.dimensionsWatcher.subscribe(this.onDimensions.bind(this));
    this.scene = new DefaultScene(this.renderer, this.camera, this.fontManager, this.effectsComposer, this.mouseWatcher);
    this.scene.setup();
    this.dom.appendChild(this.renderer.domElement);
  }

  load(example: Example) {
    this.exampleLoader.load(example.id, example.libraryPath).subscribe((library: GLTF | null) => {
      if (!library || !this.mouseWatcher) return;

      this.unload();
      this.scene = new ImportedScene(this.renderer, this.camera, this.fontManager, this.effectsComposer, library);
      this.scene.setup();
    });
  }

  unload() {
    /**
     * This should revert to a loading or placeholder script before
     * the new scene is set. Maybe this could fade out?
     */
    this.effectsComposer.removeAllPasses();
    this.scene?.teardown();
  }

  private onDimensions(dims: Vector2) {
    this.renderer.setSize(dims.x, dims.y);
    this.effectsComposer.setSize(dims.x, dims.y);
    this.camera.aspect = dims.x / dims.y;
    this.camera.updateProjectionMatrix();
  }
}