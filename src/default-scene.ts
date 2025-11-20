import { EffectPass, RenderPass, Selection, SelectiveBloomEffect, type EffectComposer } from "postprocessing";
import type { ExampleScene } from "./interfaces/example-scene";
import type { FontManager } from "./core/font-manager";
import { Color, Mesh, MeshBasicMaterial, Scene, SphereGeometry, TorusGeometry, type PerspectiveCamera, type WebGLRenderer } from "three";
import { SineValue } from "./core/sine-value";
import { LinearValue } from "./core/linear-value";
import type { MouseWatcher } from "./core/mouse-watcher";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const ringRotations: [number, number][] = [
  [0.1, 2],
  [3, -1],
  [0.2, 1.5],
  [-3, 0.9],
  [-1, -2],
  [2, -0.5],
  [-0.1, 2.7],
  [1.1, 0],
  [0, 1.1],
];
const sphereRadius = 0.2;
const torusRadius = 1;
const torusLineWidth = 0.01;

export class DefaultScene implements ExampleScene {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private effectComposer: EffectComposer;
  private selectiveBloomEffect?: SelectiveBloomEffect;
  private intensityAnimation: SineValue = new SineValue(Date.now(), 1 / 10000, 2, 15);
  private rotationAnimation: LinearValue = new LinearValue(Date.now(), 0.2);
  private sphere?: Mesh;
  private toruses: Mesh[] = [];
  private orbitControls?: OrbitControls;

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera, _fontManager: FontManager, effectComposer: EffectComposer, _mouseWatcher: MouseWatcher) {
    this.scene = new Scene();
    this.renderer = renderer;
    this.camera = camera;
    this.effectComposer = effectComposer;
  }

  setup(): void {
    this.scene.background = (new Color()).setHex(0x010412);
    const sphereMaterial = new MeshBasicMaterial({ color: 0x83c0fc });
    const ringMaterial = new MeshBasicMaterial({ color: 0x2061a1 });
    this.sphere = new Mesh(
      new SphereGeometry(sphereRadius),
      sphereMaterial
    );
    this.toruses = ringRotations.map<Mesh>(([x, y]) => {
      const torus = new Mesh(
        new TorusGeometry(
          torusRadius,
          torusLineWidth,
        ),
        ringMaterial
      );

      torus.rotateX(x);
      torus.rotateY(y);

      return torus;
    });

    [this.sphere, ...this.toruses].forEach(mesh => this.scene.add(mesh));
    this.selectiveBloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
      mipmapBlur: true,
      luminanceThreshold: 0.3,
      intensity: 0,
    });
    this.selectiveBloomEffect.selection = new Selection([this.sphere]);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));
    this.effectComposer.addPass(new EffectPass(this.camera, this.selectiveBloomEffect));
    this.camera.position.z = 15;
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.autoRotate = true;
    this.orbitControls.autoRotateSpeed = 5;

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  teardown(): void {
    this.renderer.setAnimationLoop(null);
    this.orbitControls?.dispose();
  }

  render(time: number): void {
    this.intensityAnimation.advance(time);
    this.rotationAnimation.advance(time);

    if (this.selectiveBloomEffect) {
      this.selectiveBloomEffect.intensity = this.intensityAnimation.value;
    }

    this.toruses.forEach((torus, index) => {
      const multipliers = ringRotations[index];
      if (!multipliers) return;

      torus.rotation.x += (multipliers[0] * this.rotationAnimation.value);
      torus.rotation.y += (multipliers[1] * this.rotationAnimation.value);
    });

    this.effectComposer.render();
  }
}