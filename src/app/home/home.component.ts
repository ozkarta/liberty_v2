import {Component, OnInit} from '@angular/core';
import {LibertyUserModel} from '../models/liberty-user.model';
import {AuthorizedUserService} from '../services/authorized-user.service';
import {NetworkingService} from '../services/networking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userData: LibertyUserModel;
  myBonus = 0;

  constructor(private currentUser: AuthorizedUserService, private network: NetworkingService) {
  }

  ngOnInit() {
    this.setUser();
  }

  setUser() {
    this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          if (userData) {
            this.userData = userData;
            if (!this.userData.isAdmin) {
              this.getMyBonus();
            }
          }
        });
  }

  getMyBonus() {
    this.network.getRequest('/bonusRewards/getUserTotalBonus')
      .subscribe(
        (response: any) => {
          this.myBonus = response;
        });
  }
}
