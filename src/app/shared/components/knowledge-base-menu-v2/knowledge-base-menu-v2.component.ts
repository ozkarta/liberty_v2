import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {BehaviorSubject, forkJoin, throwError} from "rxjs";
import {NetworkingService} from "../../../services/networking.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-knowledge-base-menu-v2',
  templateUrl: './knowledge-base-menu-v2.component.html',
  styleUrls: ['./knowledge-base-menu-v2.style.css']
})

export class KnowledgeBaseMenuV2Component  implements OnInit, OnDestroy {
  categories: any = [];
  constructor(private network: NetworkingService,
              private router: Router){}

  ngOnInit() {
    this.getCategories();
  }

  ngOnDestroy() {

  }

  getCategories() {
    this.network.getRequest('/liberty-category/all') // TODO too many calls for the page, API needs to be refactored
      .subscribe(
        (categories: any[]) => {  // TODO add category model
          this.categories = categories;
        },
        error => { // TODO handle error
          console.dir(error);
        });
  }

  clickEventHandler(product) {
    if (product && product.id) {
      this.router.navigate([`/knowledge-base/${product.id}`]);
    }
  }
}
