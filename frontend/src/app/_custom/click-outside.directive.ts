import { Directive, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { SpinnerService } from '@app/_services/spinner.service';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {

  @Output() clickOutside = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private spinner: SpinnerService
  ) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    if(!this.spinner.isSpinnerVisible()){
      const clickedInside = this.elementRef.nativeElement.contains(target);
      if (!clickedInside) {
        this.clickOutside.emit();
      }
    }
  }
}