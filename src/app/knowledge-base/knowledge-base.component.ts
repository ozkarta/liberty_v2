import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { LibertyUserModel } from '../models/liberty-user.model';
import { AuthorizedUserService } from '../services/authorized-user.service';
import {ActivatedRoute, Router} from '@angular/router';
import { NetworkingService } from '../services/networking.service';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.style.css'],
})
export class KnowledgeBaseComponent implements OnInit, OnDestroy {
  user: LibertyUserModel;
  productId: number = null;
  product: any = null; // TODO type
  routeUrlSubscription: Subscription = null;
  // _________________________________
  navItems: any[] = [];
  isFullComents = false;
  FAQOpen = false;
  FAQQuestions = {
    '2x2': 'რამდენია 2ჯერ 2',
    mars: 'არსებობს სიცოცხლე მარსზე?',
  };
  FAQAnswers = {
    '2x2': '2ჯერ 2 არის 4',
    mars: 'მეცნიერებს ამაზე პასუხი ჯერ არ აქვთ',
  };
  FAQAnswer = '';
  // menuJson = [
  //   {
  //     title: 'ანგარიშები & ბარათები',
  //     children: [
  //       {},
  //     ],
  //   },
  // ];
  commentExpandText: string;
  // displayedColumns = ['name'];
  // bonusSystems: BonusSystem[] = [];
  // dataSource = new MatTableDataSource(this.bonusSystems);
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private currentUser: AuthorizedUserService,
              private router: Router,
              private route: ActivatedRoute,
              private network: NetworkingService,
              public dialog: MatDialog) {
    this.isFullComents = false;
    // this.commentExpandText = 'ყველა კომენტარის ნახვა';
  }

  ngOnInit() {
    this.checkUserIsAdmin();
    this.subscribeUrlParameters();
  }

  ngOnDestroy() {
    if (this.routeUrlSubscription) {
      this.routeUrlSubscription.unsubscribe();
    }
  }

  subscribeUrlParameters() {
    this.routeUrlSubscription = this.route.params.subscribe(params => {
      this.productId = +params['productId'];
      if (this.productId) {
        this.getProductById();
      }
    });
  }

  getProductById() {
    this.network.getRequest(`/liberty-product/${this.productId}`)
      .subscribe(
        (product: any) => { // TODO add type
          this.product = product;
        },
        (error: Error) => {
          console.dir(error);
        }
      );
  }

  // is emmited when Product is clicked (menu)
  categoryClickHandler(productId: number) {
    this.router.navigate([`/knowledge-base/product/${productId}`]);
  }

  // _______________________________________________________________________

  checkUserIsAdmin() {
    this.currentUser.getUser
      .subscribe(
        (user: LibertyUserModel) => {
          this.user = user;
          // this.getBonusSystems();
          if (user) {
            //this.createNavigations(user);
          }
        });
  }

  createNavigations(userData) {
    if (userData.isAdmin) {
      this.navItems = [
        {
          route: '/home',
          iconName: 'home',
          title: 'მთავარი',
        },
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
      ];
    } else {
     this.navItems = [
       {
         route: '/home',
         iconName: 'home',
         title: 'მთავარი',
       },
       {
         route: '/profile',
         iconName: 'perm_identity',
         title: 'ჩემი შედეგი',
       },
       {
         route: '/my-transactions',
         iconName: 'trending_up',
         title: 'ჩემი რაოდენობა',
       },
       {
         route: '/employees',
         iconName: 'trending_up',
         title: 'ჩემი გუნდის ოპერაციები',
         shouldNotBeRendered: !(userData && userData.userStaffLevel && (userData.userStaffLevel === 'FIRST_LEVEL_MANAGER' ||
           userData.userStaffLevel === 'SECOND_LEVEL_MANAGER' ||
           userData.userStaffLevel === 'THIRD_LEVEL_MANAGER' ||
           userData.userStaffLevel === 'FOURTH_LEVEL_MANAGER'))
       },
       {
         route: '/branch-bonuses',
         iconName: 'insert_chart',
         title: 'საბონუსე სისტემა',
       },
       {
         route: '/org-chart',
         iconName: 'device_hub',
         title: 'ორგანიზაციული სტრუქტურა',
       },
       {
         route: '/knowledge-base',
         iconName: 'info',
         title: 'ცოდნის ბაზა',
       }
     ];
    }
  }

  expandComments() {
    this.isFullComents = !this.isFullComents;
  }

  expandFAQ() {
    this.FAQOpen = !this.FAQOpen;
    this.FAQAnswer = '';
  }

  getFaqKeys() {
    return Object.keys(this.FAQQuestions);
  }

  showFAQAnswer(key) {
    this.FAQAnswer = this.FAQAnswers[key];
  }
}
