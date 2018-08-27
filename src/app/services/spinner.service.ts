import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
@Injectable()
export class SpinnerService {
  private isLoadingIndicator: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
  }

  public isLoading() {
    return this.isLoadingIndicator;
  }

  public next(value: boolean) {
    this.isLoadingIndicator.next(value);
  }
}
