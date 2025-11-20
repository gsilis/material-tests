import { AmbientLight, BoxGeometry, Color, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene, Vector3, type PerspectiveCamera, type WebGLRenderer } from "three";
import type { FontManager } from "./core/font-manager";
import { RenderPass, type EffectComposer } from "postprocessing";
import type { ExampleScene } from "./interfaces/example-scene";
import type { GLTF } from "three/examples/jsm/Addons.js";

export class ImportedScene implements ExampleScene {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private effectComposer: EffectComposer;
  private library: GLTF;
  private scene: Scene = new Scene();
  private directionalLight: DirectionalLight = new DirectionalLight(0xFFFFFF, 10);

  constructor(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    _fontManager: FontManager,
    effectComposer: EffectComposer,
    library: GLTF
  ) {
    this.renderer = renderer;
    this.camera = camera;
    this.effectComposer = effectComposer;
    this.library = library;
    this.directionalLight.position.set(2, 5, 5);
    this.directionalLight.target.position.set(0, 0, 0);
  }

  setup() {
    this.scene.background = (new Color()).setHex(0x010412);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));
    this.scene.add(this.directionalLight);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.scene.add(this.library.scene);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  teardown() {
    this.renderer.setAnimationLoop(null);
  }

  render(_time: number): void {
    this.effectComposer.render();
  }
}