import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpinnerService} from '../../../services/spinner.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.style.css'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isLoading = false;
  private spinnerSubscription: Subscription = null;
  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.spinnerSubscription = this.spinnerService.isLoading().subscribe(
      value => {
        this.isLoading = value;
      }
    );
  }

  ngOnDestroy() {
    if (this.spinnerSubscription) {
      this.spinnerSubscription.unsubscribe();
    }
  }
}
