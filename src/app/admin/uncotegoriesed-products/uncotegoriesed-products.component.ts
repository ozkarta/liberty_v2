import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetworkingService} from '../../services/networking.service';
import {AdminUncategorizedProductsFormComponent} from './uncotegoriesed-products-form.component';
import {MatDialog} from '@angular/material';
import {SpinnerService} from '../../services/spinner.service';
@Component({
  selector: 'app-admin-uncotegoriesed-products',
  templateUrl: './uncotegoriesed-products.component.html',
  styleUrls: ['./uncotegoriesed-products.style.css'],
})

export class AdminUncategorizedProductsComponent implements OnInit, OnDestroy {
  uncategorizedProducts: any[] = [];
  displayedColumns: any[] = ['id', 'name', 'actions'];
  categories: any[] = [];
  constructor(
    private network: NetworkingService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
  ) {}

  ngOnInit() {
    this.loadUncategorizedProducts();
  }

  ngOnDestroy() {

  }

  openDialog(product): void {
    const dialogRef = this.dialog.open(AdminUncategorizedProductsFormComponent, {
      width: '500px',
      data: {product: product, categories: this.categories},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.loadUncategorizedProducts();
      }
    });
  }

  loadUncategorizedProducts() {
    this.spinnerService.next(true);
    this.network.getRequest(`/liberty-product/all-uncategorized`)
      .subscribe(
        (products) => {
          this.spinnerService.next(false);
          this.uncategorizedProducts = products;
          this.getCategories();
        },
        (error: Error) => {
          this.spinnerService.next(false);
          console.dir(error);
          // TODO handle error
        }
      );
  }

  getCategories() {
    this.spinnerService.next(true);
    this.network.getRequest('/liberty-category/all')
      .subscribe(
        (categories: any[]) => { // TODO add type
          this.spinnerService.next(false);
          if (categories) {
            this.categories = categories;
          }
        },
        (error: Error) => {
          this.spinnerService.next(false);
          console.dir(error); // TODO handle error
        }
      );
  }

  deleteProduct(event: Event, productId) {
    this.spinnerService.next(true);
    this.network.deleteRequest(`/liberty-product/delete/${productId}`)
      .subscribe(
        (success: Response) => {
          this.spinnerService.next(false);
         this.loadUncategorizedProducts();
        },
        (error: Error) => {
          // TODO handle error
          console.dir(error);
          this.spinnerService.next(false);
        }
      );

    event.preventDefault();
  }

  editProduct(event: Event, product: any) {
    this.openDialog(product)
    event.preventDefault();
  }
}
