import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {NetworkingService} from '../../../services/networking.service';
import {BehaviorSubject, forkJoin, Subscription, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-knowledge-base-menu',
  templateUrl: './knowledge-base-menu.component.html',
  styleUrls: ['./knowledge-base-menu.style.css'],
})

export class KnowledgeBaseMenuComponent implements OnInit, OnDestroy {
  @Input()
  public shouldEmitFirstId = true;
  @Output() categoryClickHandler = new EventEmitter<boolean>();
  @Input()
  public loadCategoryTrigger: BehaviorSubject<boolean>;
  loadCategoryTriggerSubscription: Subscription;
  public maxCategoryCountInRow = 6;
  loadedCategories = [];
  routeUrlSubscription: Subscription;
  productId: number = null;

  constructor(private network: NetworkingService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscribeUrlParameters();
    this.subscribeCategoryLoadTrigger();
  }

  ngOnDestroy() {
    if (this.routeUrlSubscription) {
      this.routeUrlSubscription.unsubscribe();
    }

    if (this.loadCategoryTriggerSubscription) {
      this.loadCategoryTriggerSubscription.unsubscribe();
    }
  }

  subscribeCategoryLoadTrigger() {
    if (this.loadCategoryTrigger) {
      this.loadCategoryTriggerSubscription = this.loadCategoryTrigger.subscribe(shouldUpdate => {
        if (shouldUpdate) {
          this.getCategories();
        }
      });
    }
  }

  subscribeUrlParameters() {
    this.routeUrlSubscription = this.route.params.subscribe(params => {
      this.productId = +params['productId'];
      this.getCategories();
    });
  }

  mutateCategoriesToFitMaxCategoryCountInRow(categories) {
    let newCategoryArray = [];
    if (categories.length > this.maxCategoryCountInRow) {
      newCategoryArray = categories.slice(0, this.maxCategoryCountInRow );
      newCategoryArray.push(
        {
          name: 'სხვა',
          id: 'MERGED_ARTIFICIAL_ID',
          childCategories: categories.slice(this.maxCategoryCountInRow, categories.length),
        }
      );
    }

    return newCategoryArray;
  }

  clickEventHandler(product: any) {
    this.categoryClickHandler.emit(product.id);
  }

  getCategories() {
    this.network.getRequest('/liberty-category/all') // TODO too many calls for the page, API needs to be refactored
      .subscribe(
        (categories: any[]) => {  // TODO add category model
          if (categories && categories.length) {
            const productObservableArray = []; // TODO add type
            categories.forEach(category => { // TODO add type
              productObservableArray.push(
                this.network.getRequest(`/liberty-product/byCategory/${category.id}`)
                  .pipe(
                    map(products => { // TODO add type
                      // add products to category and return category
                      category.products = products
                      return category;
                    }),
                    catchError(
                      (error: Response) => {
                        return throwError(error);
                      })
                  ));
            });

            forkJoin(productObservableArray)
              .subscribe(
                data => {
                  // Categories already include products
                  this.loadedCategories = this.mutateCategoriesToFitMaxCategoryCountInRow(data);
                  // Choose first valid product ID
                  if (!this.productId && this.shouldEmitFirstId) {
                    this.getFirstValidProductIdAndEmit();
                  }
                },
                error => {
                  console.dir(error); // TODO handle error
                }
              );
          }
        },
        error => { // TODO handle error
          console.dir(error);
        });
  }

  getFirstValidProductIdAndEmit() {
    for (let i = 0; i < this.loadedCategories.length; i++) {
      if (this.loadedCategories[i] && this.loadedCategories[i].products && this.loadedCategories[i].products.length) {
        for (let j = 0; j < this.loadedCategories[i].products.length; j++) {
          if (this.loadedCategories[i].products[j] && this.loadedCategories[i].products[j].id) {
            this.categoryClickHandler.emit(this.loadedCategories[i].products[j].id);
            return;
          }
        }
        return;
      }
    }
  }

}
