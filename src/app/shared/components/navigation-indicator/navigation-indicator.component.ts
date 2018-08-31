import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {NavigationMenuService} from "../../../services/navigation-menu.service";
@Component({
  selector: 'app-navigation-indicator',
  templateUrl: 'navigation-indicator.component.html',
  styleUrls: ['navigation-indicator.style.css']
})

export class NavigationIndicatorComponent implements OnInit, OnDestroy {
  routerEventSubscription: Subscription = null;
  indicators: any[] = [];
  navigationMenuItemSubscription: Subscription;
  menuItems: any[] = null;
  url = null;

  constructor(public router: Router,
              private navigationMenuService: NavigationMenuService) {}

  ngOnInit() {
    this.subscribeNavigationMenuItems();
    this.subscribeRouterEvents();
  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
    if (this.navigationMenuItemSubscription) {
      this.navigationMenuItemSubscription.unsubscribe();
    }
  }

  subscribeNavigationMenuItems() {
    this.navigationMenuItemSubscription = this.navigationMenuService.menuItems.subscribe(
      (menuItems) => {
        this.menuItems = menuItems;
        this.composeIndicators();
      }
    )
  }

  // subscribeRouterEvents() {
  //   this.routerEventSubscription = this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       let url = event.urlAfterRedirects || event.urlAfterRedirects || event.url ;
  //       if (!url) {
  //         return;
  //       }
  //       let splittedArray = url.split('/');
  //       if (splittedArray) {
  //
  //         this.indicators = splittedArray.map(item => {
  //           let result = '';
  //           switch(item) {
  //             case '':
  //               result = 'ინტრანეტი';
  //               break;
  //             case 'bonus':
  //               result = 'ბონუსი';
  //               break;
  //             case 'profile':
  //               result = 'ჩემი შედეგი';
  //               break;
  //             case 'my-transactions':
  //               result = 'ჩემი რაოდენობა';
  //               break;
  //             case 'employees':
  //               result = 'ჩემი გუნდის ოპერაციები';
  //               break;
  //             case 'org-chart':
  //               result = 'ორგანიზაციული სტრუქტურა';
  //               break;
  //             case 'knowledge-base':
  //               result = 'ცოდნის ბაზა';
  //               break;
  //
  //             default: result = item;
  //           }
  //           return result;
  //         });
  //       }
  //     }
  //   });
  //
  // }

  subscribeRouterEvents() {
    this.routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.urlAfterRedirects || event.urlAfterRedirects || event.url ;
        this.composeIndicators();
      }
    });
  }

  composeIndicators() {
    // exit if menu items or URL is null or empty
    if (!(this.menuItems && this.menuItems.length)) {
      return;
    }
    if (!(this.url && this.url.length)) {
      return;
    }

    // ძალიან სიმახინჯეა მაგრამ მოკლედ მოვყვები შინაარსს
    // გვაქვს აქტიური მისამართი რომელზეც იუზერი დგას
    // ასევე გვაქვს მენიუს კონფიგურაცია, rout ებს მისამართებით და სახელებით
    // ფუნქცია ეძებს url  ის  ყოველი სეგმენტისთვის match  ს თითოეულ rout  ში
    // თუ ასეთს იპოვის შემდეგ url  ს სეგმენტს ეძებს უკვე ნაპოვნი rout  ის children ებში
    // და ბოლოს ავსებს ხატავს ბრაუზერში
    let target = this.menuItems;
    let splittedUrl = this.url.split('/');
    let resultArray = [];
    let isAdmin = false;
    for (let routeSequence of splittedUrl) {
      if (!routeSequence) {
        resultArray.push(
          {
            route: '/',
            title: 'ინტრანეტი',
          }
        );
        continue;
      }

      if (routeSequence === 'admin') {
        isAdmin = true;
        resultArray.push(
          {
            route: '/',
            title: 'ადმინისტრაცია',
          }
        );
        continue;
      }

      if (target) {
        let isMatch = false;
        for (let menuItem of target) {
          // Add Admin prefix if it's admin route
          if (`/${isAdmin? 'admin/': ''}${routeSequence}` === menuItem.route) {
            isMatch = true;
            resultArray.push(
              {
                route: menuItem.route,
                title: menuItem.title,
              }
            );
            if (menuItem.children) {
              target = menuItem.children;
            } else {
              target = null;
            }
            break;
          }
        }
        if (!isMatch) {
          resultArray.push(
            {
              route: routeSequence,
              title: routeSequence,
            }
          );
        }
      }
    }
    this.indicators = resultArray;

  }

}
