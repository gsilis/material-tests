import { AmbientLight, BoxGeometry, BoxHelper, Color, DoubleSide, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Scene, ShapeGeometry, type PerspectiveCamera, type WebGLRenderer } from "three";
import type { ExampleScene } from "./interfaces/example-scene";
import type { FontManager } from "./core/font-manager";
import { FONT } from "./constants/font";
import type { Font } from "three/examples/jsm/Addons.js";

export class DefaultScene implements ExampleScene {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private fontManager: FontManager;
  private ambient: AmbientLight;

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera, fontManager: FontManager) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = new Scene();
    this.fontManager = fontManager;
    this.ambient = new AmbientLight(0xFFFFFF, 50);
  }

  setup() {
    const primaryColor = (new Color()).setHex(0x140800);
    const secondaryColor = (new Color()).setHex(0x050f3b);
    const tertiaryColor = (new Color()).setHex(0x020617);

    const primaryMaterial = new MeshStandardMaterial({ color: primaryColor, wireframe: true });
    const secondaryMaterial = new MeshStandardMaterial({ color: secondaryColor, wireframe: true, opacity: 0.2, transparent: true });
    const tertiaryMaterial = new MeshStandardMaterial({ color: tertiaryColor, wireframe: true, opacity: 0.2, transparent: true });

    const planeGeom = new PlaneGeometry(100, 100, 200, 200);
    const planeMesh = new Mesh(planeGeom, tertiaryMaterial);
    planeMesh.position.set(0, 0, 0);
    this.scene.add(planeMesh);

    // This should always be EVEN
    const runs = 100;
    const start = (runs / 2);

    for (let multiX = -start; multiX < start; multiX++) {
      for (let multiY = -start; multiY < start; multiY++) {
        const boxGeom = new BoxGeometry(1, 1, 1, 5, 5, 5);
        const boxMesh = new Mesh(boxGeom, secondaryMaterial);
        boxMesh.position.set(multiX * 2, multiY * 2, 0.5);

        this.scene.add(boxMesh);
      }
    }

    const messagePlaneGeom = new PlaneGeometry(5, 5, 60, 60);
    const messagePlane = new Mesh(messagePlaneGeom, primaryMaterial);
    messagePlane.position.set(0, 0, 2);
    this.scene.add(messagePlane);

    this.fontManager.fontFor(FONT.helvetikerRegular).subscribe((font: Font | null) => {
      if (!font) return;
      this.addMessage(font);
    });

    this.camera.position.z = 15;
    this.scene.add(this.ambient);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  teardown() {
    this.renderer.setAnimationLoop(null);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  private addMessage(font: Font) {
    console.log('DONE');
    const color = (new Color()).setHex(0xFFFFFF);
    const textMaterial = new MeshBasicMaterial({ color, side: DoubleSide });
    const awaitingShape = font.generateShapes('AWAITING', 0.4);
    const selectionShape = font.generateShapes('SELECTION', 0.4);
    const awaiting = new ShapeGeometry(awaitingShape, 20);
    const selection = new ShapeGeometry(selectionShape, 20);
    const awaitingMesh = new Mesh(awaiting, textMaterial);
    const selectionMesh = new Mesh(selection, textMaterial);

    awaiting.computeBoundingBox();
    selection.computeBoundingBox();
    const awaitingPositionMin = awaiting.boundingBox?.min || { x: 0, y: 0 };
    const awaitingPositionMax = awaiting.boundingBox?.max || { x: 0, y: 0 };
    const selectionPositionMin = selection.boundingBox?.min || { x: 0, y: 0 };
    const selectionPositionMax = selection.boundingBox?.max || { x: 0, y: 0 };
    const awaitingX = (awaitingPositionMax.x - awaitingPositionMin.x) / 2;
    const awaitingY = (awaitingPositionMax.y - awaitingPositionMin.y) / 2;
    const selectionX = (selectionPositionMax.x - selectionPositionMin.x) / 2;
    const selectionY = (selectionPositionMax.y - selectionPositionMin.y) / 2;
    awaitingMesh.position.set(-awaitingX, awaitingY + 0.3, 2.5);
    selectionMesh.position.set(-selectionX, -selectionY - 0.3, 2.5);

    this.scene.add(awaitingMesh);
    this.scene.add(selectionMesh);
  }
}