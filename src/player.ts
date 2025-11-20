import { HalfFloatType, PerspectiveCamera, WebGLRenderer } from "three";
import { RenderSizeMatcher } from "./core/render-size-matcher";
import type { Example } from "./examples";
import type { ExampleScene } from "./interfaces/example-scene";
import { DefaultScene } from "./default-scene";
import { FontManager } from "./core/font-manager";
import { ExampleLoader } from "./core/example-loader";
import { EffectComposer } from "postprocessing";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { ImportedScene } from "./imported-scene";

export class Player {
  private camera: PerspectiveCamera;
  private dom?: HTMLElement;
  private renderer: WebGLRenderer;
  private renderSizeMatcher: RenderSizeMatcher;
  private scene: ExampleScene;
  private fontManager: FontManager;
  private exampleLoader: ExampleLoader;
  private effectsComposer: EffectComposer;

  constructor() {
    this.camera = new PerspectiveCamera(75, 1);
    this.camera.position.set(0, 0, 0);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.effectsComposer = new EffectComposer(this.renderer, { multisampling: 8, frameBufferType: HalfFloatType });
    this.renderSizeMatcher = new RenderSizeMatcher(this.renderer, this.camera, this.effectsComposer);
    this.fontManager = new FontManager();
    this.scene = new DefaultScene(this.renderer, this.camera, this.fontManager, this.effectsComposer);
    this.exampleLoader = new ExampleLoader();
  }

  attach(dom: HTMLDivElement) {
    this.dom = dom;
    this.renderSizeMatcher.watch(this.dom);
    this.scene.setup();

    this.dom.appendChild(this.renderer.domElement);
  }

  load(example: Example) {
    this.exampleLoader.load(example.id, example.libraryPath).subscribe((library: GLTF | null) => {
      if (!library) return;

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
    console.log('Unloading...');
    this.effectsComposer.removeAllPasses();
    this.scene.teardown();
  }
}