import type { PerspectiveCamera, WebGLRenderer } from "three";

export class RenderSizeMatcher {
  private renderer: WebGLRenderer;
  private source?: HTMLElement;
  private observer: ResizeObserver;
  private camera: PerspectiveCamera;

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera) {
    this.renderer = renderer;
    this.camera = camera;
    this.observer = new ResizeObserver(this.onResize.bind(this));
  }

  watch(source: HTMLElement) {
    if (this.source) {
      this.observer.unobserve(this.source);
    }
  
    this.source = source;
    this.observer.observe(this.source);
  }

  private onResize(entries: ResizeObserverEntry[]) {
    const rect = entries[0]?.contentRect;

    if (rect) {
      this.setDimensions(rect);
    }
  }

  private setDimensions(rect: DOMRectReadOnly) {
    const ratio = rect.width / rect.height;

    this.renderer.setSize(rect.width, rect.height);
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
}