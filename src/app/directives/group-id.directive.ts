import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGroupId]',
})
export class GroupIdDirective implements  OnInit {
  @Input() appGroupId: string;

  constructor (private _elRef: ElementRef, private _renderer: Renderer2) { }

  ngOnInit() {
    this._renderer.setAttribute(this._elRef.nativeElement, 'groupId', this.appGroupId);
  }

}
