import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[marginer]',
})
export class MarginerDirective {
  @Input() marginer: number = 50;
  private domElement: HTMLElement;
  constructor(private elementRef: ElementRef) {
    this.domElement = this.elementRef.nativeElement as HTMLElement;
    this.domElement.style.width = '100%';
    this.domElement.style.height = this.marginer + 'px';
  }
}
