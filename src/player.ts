import { PerspectiveCamera, WebGLRenderer } from "three";
import { RenderSizeMatcher } from "./core/render-size-matcher";
import type { Example } from "./examples";

export class Player {
  private camera: PerspectiveCamera;
  private dom?: HTMLElement;
  private renderer: WebGLRenderer;
  private renderSizeMatcher: RenderSizeMatcher;

  constructor() {
    this.camera = new PerspectiveCamera(75, 1);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderSizeMatcher = new RenderSizeMatcher(this.renderer, this.camera);
  }

  attach(dom: HTMLDivElement) {
    this.dom = dom;
    this.renderSizeMatcher.watch(this.dom);

    this.dom.appendChild(this.renderer.domElement);
  }

  load(example: Example) {
    console.log('Loading', example.title);
  }

  unload() {
    console.log('Unloading...');
  }
}