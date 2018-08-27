import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthorizedUserService} from '../../services/authorized-user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NetworkingService} from '../../services/networking.service';
import {BehaviorSubject, Subscription, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {FileUploader} from 'ng2-file-upload';
import {NgForm} from '@angular/forms';
import {SpinnerService} from '../../services/spinner.service';

@Component({
  selector: 'app-admin-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.style.css'],
})

export class AdminKnowledgeBaseComponent implements OnInit, OnDestroy {
  formType = 'CREATE';
  product: any = null; // TODO add type
  productId: number = null;
  routeUrlSubscription: Subscription = null;
  categories: any[] = []; // TODO add real type
  fileUploadUrl = '';
  globalErrorMessage = ''; // TODO show error
  loadCategoryTrigger: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public fileUploader: FileUploader = null;

  constructor(private currentUser: AuthorizedUserService,
              private router: Router,
              private network: NetworkingService,
              private route: ActivatedRoute,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.subscribeUrlParameters();
    this.getCategories();
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
        this.generateUpdateForm();
      } else {
        this.generateCreateForm();
      }
    });
  }
  // is emmited when Product is clicked (menu)
  categoryClickHandler(productId: number) {
    this.router.navigate([`/admin/knowledge-base/product/${productId}`]);
  }

  generateUpdateForm() {
    this.formType = 'UPDATE';
    this.getProductById();
    if (this.generateFileUploadUrl()) {
      this.fileUploader = new FileUploader({url: this.fileUploadUrl});
      this.fileUploader.onAfterAddingFile = (fileItem) => {
        // let file = fileItem['some'];
        // let myReader:FileReader = new FileReader();
        // myReader.onloadend = (e) => {
        //   //  TODO validate file there and  read content in case it is needed
        // };
        // myReader.readAsDataURL(file);
        // return '';
        this.upload();
      };
    }
  }

  generateCreateForm() {
    this.formType = 'CREATE';
    this.product = {
      categoryId: '',
      name: '',
      category: {
        id: ''
      }
    };
  }

  generateFileUploadUrl() {
    if (this.productId) {
      // this.fileUploadUrl = `/upliadProductMedia/${this.productId}`;
      this.fileUploadUrl = `${this.network.url}/upliadProductMedia/${this.productId}`;
      // this.fileUploadUrl = 'https://evening-anchorage-3159.herokuapp.com/api/';
      return true;
    }
    return false;
  }

  upload() {
    if (!this.fileUploader && !this.fileUploader.queue || !this.fileUploader.queue.length) {
      return;
    }

    this.fileUploader.options.url = this.fileUploadUrl;
    this.fileUploader.queue.forEach(item => {
      item.url = this.fileUploadUrl;
      item.upload();
    });
    this.fileUploader.onCompleteAll = () => {
      this.getProductAttachments();
    };
  }

  getProductAttachments() {
    this.spinnerService.next(true);
    this.network.getRequest(`/product-media/of/${this.productId}`)
      .subscribe(
        (productMediaList) => {
          this.spinnerService.next(false);
          this.product.productMediaList = productMediaList;
        },
        (error: Error) => {
          this.spinnerService.next(false);
          // TODO handle error
          console.dir(error);
        }
      );
  }

  formSubmit() {
    if (this.formType === 'CREATE') {
      this.createNewProduct(this.product);
    }

    if (this.formType === 'UPDATE') {
      this.updateProduct(this.product);
    }
  }

  disableForm(productForm: NgForm) {
    return !productForm.valid;
  }
  // HTTP Requests
  createNewProduct(product: any) { // TODO add type
    this.spinnerService.next(true);
    this.network.postRequest(product, `/liberty-product/add`)
      .pipe(
        map(createdProduct => {
          if (createdProduct) {
            // TODO createdProduct.categoryId = createdProduct.category.id;
          }
          return createdProduct;
        }),
        catchError(
          (error: Response) => {
            return throwError(error);
          })
      ).subscribe(
      (createdProduct: any) => {
        this.spinnerService.next(false);
        // Load updated menu
        this.loadCategoryTrigger.next(true);

        // TODO API needs some changes, we need productId to move to update form
        // If we get product ID from the request
        // or we can navigate to update URL
        this.categoryClickHandler(createdProduct.id);
      },
      (error: Error) => {
        this.spinnerService.next(false);
        // TODO handle error
        console.dir(error);
      }
    );
  }

  deleteProduct(event: Event) {
    this.spinnerService.next(true);
    this.network.deleteRequest(`/liberty-product/delete/${this.productId}`)
      .subscribe(
        (success: Response) => {
          this.spinnerService.next(false);
          this.router.navigate(['/admin/knowledge-base']);
        },
        (error: Error) => {
          this.spinnerService.next(false);
          // TODO handle error
          console.dir(error);
        }
      );

    event.preventDefault();
  }

  updateProduct(product: any) { // TODO add type
    if (!(product && product.id)) {
      this.globalErrorMessage = 'პროდუქტის რედაქტირება შეუძლებელია.';
      return;
    }
    this.spinnerService.next(true);
    this.network.putRequest(product, `/liberty-product/update/${product.id}`)
      .subscribe(
        (updatedProduct: any) => {
          // Update product, request by url productId
          this.getProductById();
          // This will trigger Menu to request categories with products
          this.loadCategoryTrigger.next(true);
        },
        error => {
          this.spinnerService.next(false);
          console.dir(error);
        }
      );
  }

  getCategories() {
    this.spinnerService.next(true);
    this.network.getRequest('/liberty-category/all')
      .subscribe(
        (categories: any[]) => { // TODO add type
          if (categories) {
            this.categories = categories;
          }
          this.spinnerService.next(false);
        },
        (error: Error) => {
          this.spinnerService.next(false);
          console.dir(error); // TODO handle error
        }
      );
  }

  getProductById() {
    this.spinnerService.next(true);
    this.network.getRequest(`/liberty-product/${this.productId}`)
      .pipe(
        map(product => {
          product.categoryId = product.category.id;
          return product;
        }),
        catchError(
          (error: Response) => {
            return throwError(error);
          })
      )
      .subscribe(
        (product: any) => { // TODO add type
          this.product = product;
          this.spinnerService.next(false);
        },
        (error: Error) => {
          this.spinnerService.next(false);
          console.dir(error);
        }
      );
  }
}
