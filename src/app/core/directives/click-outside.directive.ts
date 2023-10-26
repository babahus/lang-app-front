import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output()
  appClickOutside: EventEmitter<void> = new EventEmitter();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: PointerEvent) {
    const nativeElement: any = this.elementRef.nativeElement;
    const clickedInside: boolean = nativeElement.contains(event.target);
    console.log(nativeElement)
    console.log(clickedInside)
    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }

  constructor(private elementRef: ElementRef) { }
}

