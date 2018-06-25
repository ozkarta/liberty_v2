import {BehaviorSubject} from 'rxjs';

export class OtherUserService {
  private selectedUserId = new BehaviorSubject<number>(null);
  getSelectedUserId = this.selectedUserId.asObservable();

  constructor() {
  }

  setUserId(id: number) {
    this.selectedUserId.next(id);
  }
}
