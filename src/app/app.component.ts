import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NetworkingService } from './services/networking.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthorizedUserService } from './services/authorized-user.service';
import { LibertyUserModel } from './models/liberty-user.model';
import { AuthService } from '@lbge/auth';
import { Subscription } from "rxjs";
import {NavigationMenuService} from "./services/navigation-menu.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  options: FormGroup;
  isAuthorized = false;
  userData: LibertyUserModel;
  navigationMenuItemSubscription: Subscription;
  menuItems: any[] = [];
  routerEventSubscription: Subscription = null;
  pageName = '';
  headerImageStyles =  {

  };
  constructor(public network: NetworkingService, fb: FormBuilder, public router: Router, private currentUser: AuthorizedUserService,
              private auth: AuthService,
              private navigationMenuService: NavigationMenuService) {
    this.options = fb.group({
      fixed: true,
    });
  }

  ngOnInit() {
    this.subscribeNavigationMenuItems();
    this.checkLoginStatus()
      .then(
        () => {
          if (this.isAuthorized) {
            this.network.getLoggedUser().then(() => {
              this.setUser();
            });
          } else {
            this.setUser();
          }
        });
    this.subscribeRouterEvents();
  }

  subscribeNavigationMenuItems() {
    this.navigationMenuItemSubscription = this.navigationMenuService.menuItems.subscribe(
      (menuItems) => {
        this.menuItems = menuItems;
      }
    )
  }

  ngOnDestroy() {
    if (this.navigationMenuItemSubscription) {
      this.navigationMenuItemSubscription.unsubscribe();
    }
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }

  setUser() {
    this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          if (userData) {
            this.checkLoginStatus().then(() => {
              if (this.isAuthorized) {
                this.userData = userData;
              }
            });
          }
        });
  }

  async checkLoginStatus() {
    this.network.isAuthorized()
      .subscribe(
        (isLoggedIn: boolean) => {
          this.isAuthorized = isLoggedIn;
        });
  }

  logout() {
    localStorage.clear();
    this.checkLoginStatus().then(() => {
      this.router.navigate(['login']).then(
        (wtf) => {
          console.log(wtf);
        });
    });
  }

  subscribeRouterEvents() {
    this.routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let url = event.urlAfterRedirects || event.urlAfterRedirects || event.url ;
        this.generatePageName(url);
      }
    });
  }

  generatePageName(url) {
    let pageName = '';
    let matchCases = [
      {
        routePrefix: '/bonus/profile',
        pageName: 'ჩემი შედეგები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/bonus/my-transactions',
        pageName: 'ჩემი რაოდენობა',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/bonus/employees',
        pageName: 'ჩემი გუნდის ოპერაციები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/bonus/branch-bonuses',
        pageName: 'საბონუსე სისტემა',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/bonus/org-chart',
        pageName: 'ორგანიზაციული სტრუქტურა',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/knowledge-base',
        pageName: 'ცოდნის ბაზა',
        headerImageUrl: '/images/image_for_liberty.jpg'
      },
      {
        routePrefix: '/home',
        pageName: 'მოთხოვნების მენეჯმენტი',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/home',
        pageName: 'კომუნიკაცია',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      //  ADMIN ___________________________
      {
        routePrefix: '/admin/bonus-systems',
        pageName: 'ბონუს სისტემები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/evaluation-groups',
        pageName: 'შეფასების ჯგუფები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/products',
        pageName: 'პროდუქტები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/branch-bonus-system',
        pageName: 'ფილიალების ჯგუფები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/staff-level-bonuses',
        pageName: 'მომხმარებლის ჯგუფის ბონუსები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/product-reordering',
        pageName: 'პროდუქტების რიგითობა',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/product-competence-level',
        pageName: 'კომპეტენციის დონე',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/product-product-edit',
        pageName: 'პროდუქტების ედიტირება',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/additional-parameters',
        pageName: 'დამატებითი პარამეტრები',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/recalculate',
        pageName: 'ბონუსის გადათვლა',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      },
      {
        routePrefix: '/admin/knowledge-base',
        pageName: 'ცოდნის ბაზა',
        headerImageUrl: '/images/image_for_liberty_bonus.jpg'
      }
    ];

    for (let item of matchCases) {
      if (url.startsWith(item['routePrefix'])) {
        pageName = item['pageName'];
        this.headerImageStyles = this.createImageStyle(item.headerImageUrl);
        console.dir(this.headerImageStyles);
      }
    }

    this.pageName = pageName;
  }

  singleSignOn() {
    if (!this.network.getCookie('access_token')) {
      this.auth.login();
    } else {
      this.checkLoginStatus().then(() => {
        if (this.isAuthorized) {
          this.network.getLoggedUser().then(() => {
            this.setUser();
          });
        } else {
          this.setUser();
        }
      });
    }
  }


  createImageStyle(imageUrl) {
    return JSON.parse(
      `{
      "background": "linear-gradient(to bottom, rgba(21, 32, 70, 0.1) 0%, rgba(16, 20, 41, 0.2) 75%, rgba(14, 21, 53, 0.65) 100%), url(${imageUrl})",
      "background-image": "-webkit-gradient(linear, left top, left bottom, from(rgba(21, 32, 70, 0.1)), color-stop(75%, rgba(16, 20, 41, 0.2)), to(rgba(14, 21, 53, 0.65))), url(${imageUrl})"
    }`
    );
  }

}
