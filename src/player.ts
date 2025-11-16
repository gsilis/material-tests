export class Player {
  private dom?: HTMLElement;

  constructor() {}

  attach(dom: HTMLDivElement) {
    this.dom = dom;
    console.log('ATTACHING!!!');
  }
}