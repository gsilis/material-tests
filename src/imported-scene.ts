import { Color, Scene, Vector3, type PerspectiveCamera, type WebGLRenderer } from "three";
import type { FontManager } from "./core/font-manager";
import { RenderPass, type EffectComposer } from "postprocessing";
import type { ExampleScene } from "./interfaces/example-scene";
import { OrbitControls, type GLTF } from "three/examples/jsm/Addons.js";
import type { LightHelper } from "./interfaces/light-helper";
import { TwoLightManager } from "./core/two-light-manager";

export class ImportedScene implements ExampleScene {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private effectComposer: EffectComposer;
  private library: GLTF;
  private scene: Scene = new Scene();
  private orbitControls?: OrbitControls;
  private lightHelper: LightHelper;

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
    this.lightHelper = new TwoLightManager();
  }

  setup() {
    this.scene.background = (new Color()).setHex(0x010412);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.scene.add(this.library.scene);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.autoRotate = true;
    this.orbitControls.autoRotateSpeed = 1;
    this.lightHelper.setup(this.scene);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  teardown() {
    this.renderer.setAnimationLoop(null);
    this.orbitControls?.dispose();
  }

  render(_time: number): void {
    this.orbitControls?.update();
    this.effectComposer.render();
  }
}