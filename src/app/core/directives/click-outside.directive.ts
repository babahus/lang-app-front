import { Directive, Output, EventEmitter, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output()
  appClickOutside: EventEmitter<void> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      return;
    }


    if (!this.hasModalClass(targetElement)) {
      this.appClickOutside.emit();
    }
  }

  private hasModalClass(element: HTMLElement | null): boolean {
    if (!element) {
      return false;
    }

    if (element.classList.contains('modal')) {
      console.log(element)
      return true;
    }

    return this.hasModalClass(element.parentElement);
  }

}

