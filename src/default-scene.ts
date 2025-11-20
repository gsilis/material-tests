import { EffectPass, RenderPass, Selection, SelectiveBloomEffect, type EffectComposer } from "postprocessing";
import type { ExampleScene } from "./interfaces/example-scene";
import type { FontManager } from "./core/font-manager";
import { BoxGeometry, Color, DoubleSide, Mesh, MeshBasicMaterial, Scene, ShapeGeometry, SphereGeometry, TorusGeometry, type PerspectiveCamera, type WebGLRenderer } from "three";
import { SineValue } from "./core/sine-value";
import { LinearValue } from "./core/linear-value";
import { Font } from "three/examples/jsm/Addons.js";
import { FONT } from "./constants/font";

const rad = Math.PI / 180;
const ringRotations: [number, number][] = [
  [0.1, 2],
  [3, -1],
  [0.2, 1.5],
  [-3, 0.9],
  [-1, -2],
  [2, -0.5],
  [0.1, 2.1],
];
const sphereRadius = 0.2;
const torusRadius = 1;
const torusLineWidth = 0.01;

export class DefaultScene implements ExampleScene {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private fontManager: FontManager;
  private effectComposer: EffectComposer;
  private selectiveBloomEffect?: SelectiveBloomEffect;
  private intensityAnimation: SineValue = new SineValue(Date.now(), 1 / 1000, 2, 15);
  private rotationAnimation: LinearValue = new LinearValue(Date.now(), 1);
  private sphere?: Mesh;
  private toruses: Mesh[] = [];

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera, fontManager: FontManager, effectComposer: EffectComposer) {
    this.scene = new Scene();
    this.renderer = renderer;
    this.camera = camera;
    this.fontManager = fontManager;
    this.effectComposer = effectComposer;
  }

  setup(): void {
    this.scene.background = (new Color()).setHex(0x010412);
    const sphereMaterial = new MeshBasicMaterial({ color: 0x83c0fc });
    const ringMaterial = new MeshBasicMaterial({ color: 0x2061a1 });
    const textMaterial = new MeshBasicMaterial({ color: 0x69a5ff, side: DoubleSide });
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
    this.fontManager.fontFor(FONT.helvetikerRegular).subscribe((font: Font | null) => {
      if (!font) return;
      const textShape = font.generateShapes('SELECT EXPERIMENT', 0.2);
      const geom = new ShapeGeometry(textShape, 20);
      const mesh = new Mesh(geom, textMaterial);
      geom.computeBoundingBox();
      
      const minx = geom.boundingBox?.min.x || 0;
      const maxx = geom.boundingBox?.max.x || 0;
      const miny = geom.boundingBox?.min.y || 0;
      const maxy = geom.boundingBox?.max.y || 0;
      const x = (maxx - minx) / 2;
      const y = (maxy - miny) / 2;
      mesh.position.set(-x, -0.75, 1);

      this.scene.add(mesh);
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
    this.camera.position.z = 10;

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  teardown(): void {
    
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