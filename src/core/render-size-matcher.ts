import type { EffectComposer } from "postprocessing";
import type { PerspectiveCamera, WebGLRenderer } from "three";

export class RenderSizeMatcher {
  private renderer: WebGLRenderer;
  private source?: HTMLElement;
  private observer: ResizeObserver;
  private camera: PerspectiveCamera;
  private composer?: EffectComposer;

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera, composer?: EffectComposer) {
    this.renderer = renderer;
    this.camera = camera;
    this.composer = composer;
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
    const width = rect.width;
    const height = rect.height;
    const ratio = width / height;

    this.renderer.setSize(width, height);
    if (this.composer) {
      this.composer.setSize(width, height);
    }
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
}