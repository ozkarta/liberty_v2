import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-admin-custom-component',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['custom-menu.css'],
})

export class CustomMenuComponent implements OnInit, OnDestroy {
  private routerEventSubscription: Subscription;
  url = '';
  @Input()
  public sidebarElements: any[] = [];
  constructor(public router: Router) {}

  ngOnInit() {
    this.url = this.router.url;
  }

  ngOnDestroy() {
  }
}
