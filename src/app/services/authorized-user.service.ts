import {AsyncSubject, BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import { LibertyUserModel } from '../models/liberty-user.model';
import {MyOperationsModel} from '../models/my-operations.model';

export class networkorizedUserService {
  private user = new BehaviorSubject<LibertyUserModel>(null);
  getUser = this.user.asObservable();

  private operations = new BehaviorSubject<MyOperationsModel[]>(null);
  getMyOperations = this.operations.asObservable();

  private bonuses = new BehaviorSubject<MyOperationsModel[]>(null);
  getMyBonuses = this.bonuses.asObservable();

  constructor() {
  }

  setUser(user: LibertyUserModel) {
    this.user.next(user);
  }

  setMyOperations(operations: MyOperationsModel[]) {
    this.operations.next(operations);
  }

  setMyBonuses(bonuses: MyOperationsModel[]) {
    this.bonuses.next(bonuses);
  }
}
