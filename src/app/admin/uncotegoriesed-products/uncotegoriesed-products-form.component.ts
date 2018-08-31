import {Component, Inject } from '@angular/core';
import {NetworkingService} from '../../services/networking.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SpinnerService} from '../../services/spinner.service';
@Component({
  selector: 'app-admin-uncotegoriesed-products',
  templateUrl: './uncotegoriesed-products-form.component.html',
  styleUrls: ['./uncotegoriesed-products-form.style.css'],
})

export class AdminUncategorizedProductsFormComponent {
  errorMessage: any = '';

  constructor(
    public dialogRef: MatDialogRef<AdminUncategorizedProductsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private network: NetworkingService,
    private spinnerService: SpinnerService,
  ) {}

  onSummit(event: Event) {
    this.updateProduct(this.data.product);
    event.preventDefault();
  }

  onDismiss(event: Event) {
    this.dialogRef.close();
  }

  updateProduct(product: any) { // TODO add type
    this.spinnerService.next(true);
    this.network.putRequest(product, `/liberty-product/update/${product.id}`)
      .subscribe(
        (category) => {
          this.spinnerService.next(false);
          this.dialogRef.close({success: true});
        },
        (error: Error) => {
          this.spinnerService.next(false);
          if (error['status'] === 406) {
            this.errorMessage = 'ასეთი კატეგორიის ID უკვე არსებობს';
            return;
          }

          this.errorMessage = 'შეცდომა კატეგორიის განახლების დროს.';
        }
      );
  }

}
