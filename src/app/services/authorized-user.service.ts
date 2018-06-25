import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../models/user.model';

export class AuthorizedUserService {
  private user = new BehaviorSubject<UserModel>(null);
  getUser = this.user.asObservable();

  constructor() {
  }

  setUser(user: UserModel) {
    this.user.next(user);
  }
}
