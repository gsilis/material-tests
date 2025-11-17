import { PerspectiveCamera, WebGLRenderer } from "three";
import { RenderSizeMatcher } from "./core/render-size-matcher";
import type { Example } from "./examples";
import { ControlsManager } from "./core/controls-manager";
import type { ExampleScene } from "./interfaces/example-scene";
import { DefaultScene } from "./default-scene";
import { FontManager } from "./core/font-manager";

export class Player {
  private camera: PerspectiveCamera;
  private dom?: HTMLElement;
  private renderer: WebGLRenderer;
  private renderSizeMatcher: RenderSizeMatcher;
  private controlsManager: ControlsManager;
  private scene: ExampleScene;
  private fontManager: FontManager;

  constructor() {
    this.camera = new PerspectiveCamera(75, 1);
    this.camera.position.set(0, 0, 0);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderSizeMatcher = new RenderSizeMatcher(this.renderer, this.camera);
    this.controlsManager = new ControlsManager(this.camera, this.renderer.domElement);
    this.fontManager = new FontManager();
    this.scene = new DefaultScene(this.renderer, this.camera, this.fontManager);
  }

  attach(dom: HTMLDivElement) {
    this.dom = dom;
    this.renderSizeMatcher.watch(this.dom);
    this.scene.setup();

    this.dom.appendChild(this.renderer.domElement);
  }

  load(example: Example) {
    console.log('Loading', example.title);
    /**
     * The context may already have the GLTF loaded, or if it does not
     * this should trigger it and wait.
     * 
     * Lighting should be controlled outside of the scene itself.
     * This is only loading the GLTF asset, and putting it in origin.
     * Lighting, camera, all that will need to be done here.
     */
  }

  unload() {
    /**
     * This should revert to a loading or placeholder script before
     * the new scene is set. Maybe this could fade out?
     */
    console.log('Unloading...');
    this.scene.teardown();
  }
}