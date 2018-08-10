import {Component, OnInit} from '@angular/core';
import {LibertyUserModel} from '../models/liberty-user.model';
import {AuthorizedUserService} from '../services/authorized-user.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userData: LibertyUserModel;
  myBonus: any;

  constructor(private currentUser: AuthorizedUserService, private auth: AuthService) {
  }

  ngOnInit() {
    this.setUser();
    this.getMyBonus();
  }

  setUser() {
    this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          this.userData = userData;
        });
  }

  getMyBonus() {
    this.auth.getRequest('/bonusRewards/getUserTotalBonus')
      .subscribe(
        (response: any) => {
          this.myBonus = response;
        });
  }
}
