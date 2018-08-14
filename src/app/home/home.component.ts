import {Component, OnInit} from '@angular/core';
import {LibertyUserModel} from '../models/liberty-user.model';
import {networkorizedUserService} from '../services/authorized-user.service';
import {NetworkingService} from '../services/networking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userData: LibertyUserModel;
  myBonus: any;

  constructor(private currentUser: networkorizedUserService, private network: NetworkingService) {
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
    this.network.getRequest('/bonusRewards/getUserTotalBonus')
      .subscribe(
        (response: any) => {
          this.myBonus = response;
        });
  }
}
