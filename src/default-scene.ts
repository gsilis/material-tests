import { AmbientLight, BoxGeometry, Mesh, MeshPhongMaterial, Scene, type Box3, type PerspectiveCamera, type WebGLRenderer } from "three";
import type { ExampleScene } from "./interfaces/example-scene";

export class DefaultScene implements ExampleScene {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private boxBackground: Mesh;
  private boxForeground: Mesh;
  private light: AmbientLight;
  private scene: Scene;

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = new Scene();
    this.light = new AmbientLight(0xFFFFFF, 4);
    this.boxBackground = new Mesh(
      new BoxGeometry(5, 2, 0.5, 10, 10, 1),
      new MeshPhongMaterial({ color: 0xFFFFFF })
    );
    this,this.boxForeground = new Mesh(
      new BoxGeometry(4, 1.5, 0.5, 10, 10, 10),
      new MeshPhongMaterial({ color: 0x00FF00 })
    );

    this.boxBackground.position.z = 2;
    this.boxForeground.position.z = 1;
  }

  setup() {
    this.renderer.setAnimationLoop(this.render.bind(this));
    this.scene.add(this.boxBackground);
    this.scene.add(this.boxForeground);
  }

  teardown() {
    this.renderer.setAnimationLoop(null);
  }

  render() {
    console.log('Rendering...');
    this.renderer.render(this.scene, this.camera);
  }
}