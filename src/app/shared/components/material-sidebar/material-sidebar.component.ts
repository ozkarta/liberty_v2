import {Component, Input, OnDestroy, OnInit} from '@angular/core'

@Component({
  selector: 'app-material-sidebar',
  templateUrl: './material-sidebar.component.html',
  styleUrls: ['./material-sidebar.style.css']
})

export class MaterialSidebarComponent implements OnInit, OnDestroy {
  @Input()
  public sidebarElements: any[] = [];
  constructor() {}

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
