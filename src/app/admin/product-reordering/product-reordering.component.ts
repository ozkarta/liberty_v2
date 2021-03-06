import { Component, OnInit } from '@angular/core';
import { NetworkingService } from '../../services/networking.service';
import { ProductModel } from '../../models/product.model';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prduct-reordering',
  templateUrl: './product-reordering.component.html',
  styleUrls: ['./product-reordering.component.css'],
})
export class ProductReorderingComponent implements OnInit {
  products: ProductModel[] = [];
  private subscription: Subscription;

  constructor(private network: NetworkingService, private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.network.getRequest('/products/all')
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
  reorderProduct(newOrder: any, id: number) {
    this.network.putRequest(parseInt(newOrder), `/products/${id}/reOrder`)
      .subscribe(
        (response: any) => {
          this.products.length = 0;
          this.getProducts();
        });
  }
}
