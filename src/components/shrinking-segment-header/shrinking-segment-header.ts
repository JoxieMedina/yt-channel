import {
  Component,
  Input,
  ElementRef,
  Renderer,
  Output,
  EventEmitter
} from '@angular/core';

@Component({selector: 'shrinking-segment-header', templateUrl: 'shrinking-segment-header.html'})
export class ShrinkingSegmentHeader {

  @Input('scrollArea')scrollArea : any;
  @Input('headerHeight')headerHeight : number;
  @Input('headerMinHeight')headerMinHeight : number;
  @Output()heightUpdated = new EventEmitter();
  newHeaderHeight : number;

  constructor(public element : ElementRef, public renderer : Renderer) {}

  ngAfterViewInit() {

    this
      .renderer
      .setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');

    this
      .scrollArea
      .ionScroll
      .subscribe((ev) => {
        this.resizeHeader(ev);
      });

  }

  resizeHeader(ev) {

    ev.domWrite(() => {

      this.newHeaderHeight = this.headerHeight - ev.scrollTop;

      if (this.newHeaderHeight < this.headerMinHeight) {
        this.newHeaderHeight = this.headerMinHeight;
      }

      this
        .renderer
        .setElementStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
          this
          .heightUpdated
          .emit(this.newHeaderHeight);

    });

  }

}
