import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-custom-menu-v2',
  templateUrl: './custom-menu-v2.component.html',
  styleUrls: ['custom-menu-v2.style.css'],
})

export class CustomMenuV2Component implements OnInit, OnDestroy {
  routerEventSubscription: Subscription = null;
  url = '';
  @Input()
  public menuElements: any[] = [];
  constructor(public router: Router) {}

  ngOnInit() {
    this.subscribeRouterEvents();
  }

  subscribeRouterEvents() {
    this.routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.urlAfterRedirects || event.urlAfterRedirects || event.url ;
      }
    });

  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }

  isMenuItemActive(route) {
    return this.url.startsWith(route);
  }
}
