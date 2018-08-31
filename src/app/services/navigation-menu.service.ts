import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {LibertyUserModel} from "../models/liberty-user.model";
import {AuthorizedUserService} from "./authorized-user.service";
import {NetworkingService} from "./networking.service";
@Injectable()
export class NavigationMenuService {
  public menuItems: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private isAuthorized = false;

  constructor(private currentUser: AuthorizedUserService,
              public network: NetworkingService) {
    this.subscribeUser();
  }

  subscribeUser() {
    this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          if (userData) {
            this.checkLoginStatus().then(() => {
              if (this.isAuthorized) {
                this.createNavigations(userData);
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

  createNavigations(userData) {
    console.log(userData);
    if (userData.isAdmin) {
      this.menuItems.next(
        [
          // {
          //   route: '/home',
          //   iconName: 'home',
          //   title: 'მთავარი',
          // },
          {
            route: '/admin/bonus-systems',
            iconName: 'perm_identity',
            title: 'ბონუს სისტემები',
          },
          {
            route: '/admin/evaluation-groups',
            iconName: 'trending_up',
            title: 'შეფასების ჯგუფები',
          },
          {
            route: '/admin/products',
            iconName: 'trending_up',
            title: 'პროდუქტები',
          },
          {
            route: '/admin/branch-bonus-system',
            iconName: 'trending_up',
            title: 'ფილიალების ჯგუფები',
          },
          {
            route: '/admin/staff-level-bonuses',
            iconName: 'trending_up',
            title: 'მომხმარებლის ჯგუფის ბონუსები',
          },
          {
            route: '/admin/product-reordering',
            iconName: 'trending_up',
            title: 'პროდუქტების რიგითობა',
          },
          {
            route: '/admin/product-competence-level',
            iconName: 'trending_up',
            title: 'კომპეტენციის დონე',
          },
          {
            route: '/admin/product-product-edit',
            iconName: 'trending_up',
            title: 'პროდუქტების ედიტირება',
          },
          {
            route: '/admin/additional-parameters',
            iconName: 'trending_up',
            title: 'დამატებითი პარამეტრები',
          },
          {
            route: '/admin/recalculate',
            iconName: 'trending_up',
            title: 'ბონუსის გადათვლა',
          },
          {
            route: '/admin/knowledge-base',
            iconName: 'trending_up',
            title: 'ცოდნის ბაზა',
          }
        ]
      );
    } else {
      this.menuItems.next(
        [
          {
            route: '/bonus',
            iconName: 'home',
            title: 'ბონუსები',
            children: [
              {
                route: '/profile',
                iconName: 'home',
                title: 'ჩემი შედეგები',
              },
              {
                route: '/my-transactions',
                iconName: 'home',
                title: 'ჩემი რაოდენობა',
              },
              {
                route: '/employees',
                iconName: 'home',
                title: 'ჩემი გუნდის ოპერაციები',
                shouldNotBeRendered: !(userData && userData.userStaffLevel && (userData.userStaffLevel === 'FIRST_LEVEL_MANAGER' ||
                  userData.userStaffLevel === 'SECOND_LEVEL_MANAGER' ||
                  userData.userStaffLevel === 'THIRD_LEVEL_MANAGER' ||
                  userData.userStaffLevel === 'FOURTH_LEVEL_MANAGER'))
              },
              {
                route: '/branch-bonuses',
                iconName: 'home',
                title: 'საბონუსე სისტემა',
              },
              {
                route: '/org-chart',
                iconName: 'home',
                title: 'ორგანიზაციული სტრუქტურა',
              },
            ]
          },
          {
            route: '/knowledge-base',
            iconName: 'home',
            title: 'ცოდნის ბაზა',
            childrenType: 'component',
            component: 'app-knowledge-base-menu-v2',
          },
          {
            route: '/home',
            iconName: 'home',
            title: 'მოთხოვნების მენეჯმენტი',
          },
          {
            route: '/home',
            iconName: 'home',
            title: 'კომუნიკაცია',
          },

        ]
      );
    }
    // this.userNavItems = [
    //   {
    //     route: '/home',
    //     iconName: 'home',
    //     title: 'მთავარი',
    //   },
    //   {
    //     route: '/profile',
    //     iconName: 'perm_identity',
    //     title: 'ჩემი შედეგი',
    //   },
    //   {
    //     route: '/my-transactions',
    //     iconName: 'trending_up',
    //     title: 'ჩემი რაოდენობა',
    //   },
    //   {
    //     route: '/employees',
    //     iconName: 'trending_up',
    //     title: 'ჩემი გუნდის ოპერაციები',
    //     shouldNotBeRendered: !(userData && userData.userStaffLevel && (userData.userStaffLevel === 'FIRST_LEVEL_MANAGER' ||
    //                                                                   userData.userStaffLevel === 'SECOND_LEVEL_MANAGER' ||
    //                                                                   userData.userStaffLevel === 'THIRD_LEVEL_MANAGER' ||
    //                                                                   userData.userStaffLevel === 'FOURTH_LEVEL_MANAGER'))
    //   },
    //   {
    //     route: '/branch-bonuses',
    //     iconName: 'insert_chart',
    //     title: 'საბონუსე სისტემა',
    //   },
    //   {
    //     route: '/org-chart',
    //     iconName: 'device_hub',
    //     title: 'ორგანიზაციული სტრუქტურა',
    //   },
    //   {
    //     route: '/knowledge-base',
    //     iconName: 'info',
    //     title: 'ცოდნის ბაზა',
    //   }
    // ];
  }
}
