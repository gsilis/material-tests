import { AmbientLight, BoxGeometry, CylinderGeometry, DodecahedronGeometry, FloatType, HalfFloatType, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, Scene, Sphere, SphereGeometry, SpotLight, TorusGeometry, Vector3, type PerspectiveCamera, type WebGLRenderer } from "three";
import type { ExampleScene } from "./interfaces/example-scene";
import type { FontManager } from "./core/font-manager";
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { Time } from "./core/time";
import { LinearValue } from "./core/linear-value";
import { SineValue } from "./core/sine-value";

const rad = Math.PI / 180;

export class DefaultScene implements ExampleScene {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private fontManager: FontManager;
  private lineMaterial?: Material;
  private box?: Mesh;
  private box2?: Mesh;
  private box3?: Mesh;
  private sphere?: Mesh;
  private scene: Scene;
  private ambient: AmbientLight;
  private composer: EffectComposer;
  private rotation = 0.2;
  private intensity = 1.2;
  private bloomEffect?: BloomEffect;
  private boxRotator = new LinearValue(Date.now(), 5);
  private sineRotator: SineValue = new SineValue(Date.now(), 1 / 1000, -5, 100);
  private scaleValue: SineValue = new SineValue(Date.now(), 1 / 1000, 1.5, 1);

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera, fontManager: FontManager) {
    this.renderer = renderer;
    this.camera = camera;
    this.fontManager = fontManager;
    this.scene = new Scene();
    this.ambient = new AmbientLight(0xFFFFFF, 1);
    this.composer = new EffectComposer(this.renderer, { multisampling: 8, frameBufferType: HalfFloatType });
  }

  setup(): void {
    this.lineMaterial = new MeshBasicMaterial({ color: 0x00FFFF, toneMapped: false, wireframe: false });
    this.box = new Mesh(
      new TorusGeometry(1, 0.01, 5),
      this.lineMaterial,
    );
    this.box.rotateX(rad * 20);
    this.box2 = new Mesh(
      new TorusGeometry(1, 0.01, 5),
      this.lineMaterial,
    );
    this.box3 = new Mesh(
      new TorusGeometry(1, 0.01, 5),
      this.lineMaterial,
    );
    this.sphere = new Mesh(
      new SphereGeometry(0.2, 32, 32),
      this.lineMaterial
    );

    const spot = new SpotLight(0xFFFFFF, 20, 0, Math.PI / 8);
    spot.target = this.box;
    spot.position.set(3, 3, 3);
    spot.target.position.set(0, 0, 0);
    this.scene.add(spot);

    // this.scene.add(this.ambient);
    this.scene.add(this.box);
    this.scene.add(this.box2);
    this.scene.add(this.box3);
    this.scene.add(this.sphere);
    this.camera.position.z = 10;

    this.camera.lookAt(new Vector3(0, 0, 0));

    const renderPass = new RenderPass(this.scene, this.camera);
    this.bloomEffect = new BloomEffect({
      mipmapBlur: true,
      luminanceThreshold: 0.4,
      intensity: 2,
    });
    const bloomPass = new EffectPass(this.camera, this.bloomEffect);

    this.composer.setSize(3000, 3000);
    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
  teardown(): void {
    throw new Error("Method not implemented.");
  }
  render(time: number): void {
    this.boxRotator.advance(time);
    this.sineRotator.advance(time);
    this.scaleValue.advance(time);
    // this.box?.scale.set(this.scaleValue.value, this.scaleValue.value, this.scaleValue.value);
    this.box?.rotateY(this.boxRotator.value);
    this.box2?.rotateX(this.boxRotator.value);
    this.box3?.rotateY(this.boxRotator.value);
    this.box3?.rotateX(this.boxRotator.value);
    // this.bloomEffect && (this.bloomEffect.intensity = this.sineRotator.value);
    this.composer.render();
  }
}