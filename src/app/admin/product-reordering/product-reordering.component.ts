import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductModel } from '../../models/product.model';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-prduct-reordering',
  templateUrl: './product-reordering.component.html',
  styleUrls: ['./product-reordering.component.css'],
})
export class ProductReorderingComponent implements OnInit, OnDestroy {
  products: ProductModel[] = [];
  private subscription: Subscription;

  constructor(private auth: AuthService, private dragulaService: DragulaService) {
    this.subscription = dragulaService.drag.subscribe((value) => {
    });
    const dropSub = dragulaService.drop.subscribe((value) => {
      this.reorderProduct(value);
    });
    this.subscription.add(dropSub);
    const overSub = dragulaService.over.subscribe((value) => {
    });
    this.subscription.add(overSub);
    const outSub = dragulaService.out.subscribe((value) => {
    });
    this.subscription.add(outSub);
  }

  ngOnInit() {
    this.getProducts();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getProducts() {
    this.auth.getRequest('/products/all')
      .subscribe(
        (groups: ProductModel[]) => {
          groups.sort((a, b) => {
            return a.productMotivationalBlockTypeId - b.productMotivationalBlockTypeId || a.sortOrder - b.sortOrder;
          });
          groups.forEach((g) => {
            this.products.push(g);
          });
        });
  }
  reorderProduct(data: any) {
    let newOrder;
    const prodId = data[1].children[0].getAttribute('groupid');
    if (data[1].previousElementSibling) {
      newOrder = data[1].previousElementSibling.getAttribute('groupid');
    } else {
      newOrder = 0;
    }
    this.auth.putRequest(parseInt(newOrder), `/products/${prodId}/reOrder`)
      .subscribe(
        (response: any) => {
          this.products.length = 0;
          this.getProducts();
        });
  }
}
