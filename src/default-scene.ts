import { AmbientLight, BoxGeometry, Color, DoubleSide, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshStandardMaterial, PCFSoftShadowMap, PointLight, Scene, ShapeGeometry, type PerspectiveCamera, type WebGLRenderer } from "three";
import type { ExampleScene } from "./interfaces/example-scene";
import type { FontManager } from "./core/font-manager";
import { FONT } from "./constants/font";

const blueLight = (new Color()).setHex(0x4dccff);
const whiteLight = (new Color()).setHex(0xffffff);

export class DefaultScene implements ExampleScene {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private boxBackground: Mesh;
  private boxForeground: Mesh;
  private light: AmbientLight;
  private backLight1: PointLight;
  private backLight2: PointLight;
  private frontLight: PointLight;
  private frontLight2: PointLight;
  private scene: Scene;
  private fontManager: FontManager;
  private fontMesh?: Mesh;
  private last: number = Date.now();
  private backCube: Mesh;

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera, fontManager: FontManager) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = new Scene();
    this.light = new AmbientLight(0xFFFFFF, 0);
    this.backLight1 = new PointLight(blueLight, 9000);
    this.backLight2 = new PointLight(blueLight, 9000);
    this.frontLight = new PointLight(whiteLight, 9000);
    this.frontLight2 = new PointLight(whiteLight, 500);
    this.fontManager = fontManager;

    const fgMaterial = new MeshStandardMaterial({ color: 0x454545 });
    const bgMaterial = new MeshStandardMaterial({ color: 0x333333 });

    [fgMaterial, bgMaterial].forEach((mat) => {
      mat.metalness = 1;
      mat.roughness = 0.1;
    });

    this.boxBackground = new Mesh(
      new BoxGeometry(5, 2, 0.5, 10, 10, 1),
      bgMaterial
    );
    this,this.boxForeground = new Mesh(
      new BoxGeometry(4, 1.5, 0.2, 10, 10, 10),
      fgMaterial
    );

    this.boxBackground.position.set(0, 0, 0);
    this.boxForeground.position.set(0, 0, 0.5);
    this.camera.position.set(0, 0, 10);
    this.backLight1.position.set(3, 2, -2);
    this.backLight2.position.set(-3, -2, -2);
    this.frontLight.position.set(0, 4, 3);
    this.frontLight2.position.set(0, -6, 3);

    [this.backLight1, this.backLight2, this.frontLight].forEach(l => {
      l.castShadow = true;
      l.shadow.mapSize.set(2048, 2048);
    });

    [this.boxBackground, this.boxForeground].forEach(b => {
      b.receiveShadow = true;
      b.castShadow = true;
    });

    const cubeMaterial = new MeshBasicMaterial({ color: 0x00FFFF, wireframe: true, transparent: true, opacity: 0.1 });
    this.backCube = new Mesh(
      new BoxGeometry(20, 20, 20, 10, 10, 10),
      cubeMaterial
    );
    const deg45 = 45 * (Math.PI / 180);
    this.backCube.position.set(0, 0, -25);
    this.backCube.rotateY(deg45);
  }

  setup() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setAnimationLoop(this.render.bind(this));
    this.scene.add(this.boxBackground);
    this.scene.add(this.boxForeground);
    this.scene.add(this.light);
    this.scene.add(this.backLight1);
    this.scene.add(this.backLight2);
    this.scene.add(this.frontLight);
    this.scene.add(this.frontLight2);
    this.scene.add(this.backCube);
    this.fontManager.fontFor(FONT.helvetikerRegular).subscribe((font) => {
      if (!font) return;

      const message = font.generateShapes('Choose an Experiment', 0.25);
      const geom = new ShapeGeometry(message);
      geom.computeBoundingBox();

      const mesh = new Mesh(geom, new MeshBasicMaterial({ color: 0xFFFFFF, side: DoubleSide, transparent: true}));
      const xMax = geom.boundingBox?.max.x || 0;
      const xMin = geom.boundingBox?.min.x || 0;
      const yMax = geom.boundingBox?.max.y || 0;
      const yMin = geom.boundingBox?.min.y || 0;
      const x = xMax - xMin;
      const y = yMax - yMin;

      mesh.position.set(-x / 2, -y / 2, 1);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      this.fontMesh = mesh;
      this.scene.add(this.fontMesh);
    });
  }

  teardown() {
    this.renderer.setAnimationLoop(null);
  }

  render() {
    this.last = Date.now();
    const movement = Math.sin((this.last / 10) * (Math.PI / 180));

    this.backCube.rotation.y += 0.0005;
    this.boxForeground.position.setZ(0.4 + 0.02 * movement);
    this.fontMesh && this.fontMesh.position.setZ(0.6 + 0.01 * movement);
    this.renderer.render(this.scene, this.camera);
  }
}