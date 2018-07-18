import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {BonusSystem} from '../bonus-systems/bonus-systems.component';

@Component({
  selector: 'app-staff-level-bonuses',
  templateUrl: './staff-level-bonuses.component.html',
  styleUrls: ['./staff-level-bonuses.component.css'],
})
export class StaffLevelBonusesComponent implements OnInit {
  staffLevels: StaffLevel[] = [];
  bonusSystems: BonusSystem[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.getStaffLevels();
    this.getBonusSystems();
  }

  getStaffLevels() {
    this.auth.getRequest('/users/allUserPositions')
      .subscribe(
        (staffLevels: StaffLevel[]) => {
          staffLevels.forEach((s) => {
            this.staffLevels.push(s);
          });
        });
  }
  getBonusSystems() {
    this.auth.getRequest('/bonusSystems/all')
      .subscribe(
        (response: BonusSystem[]) => {
          response.forEach((b) => {
            this.bonusSystems.push(b);
          });
        });
  }
  doesBranchContainsSystem(systemId: number, levelId: number) {
    const level = this.staffLevels.find(b => b.id === levelId);
    for (let i = 0; i < level.userPositionBonusSystems.length; i++) {
      if (level.userPositionBonusSystems[i].bonusSystem.id === systemId) {
        return level.userPositionBonusSystems[i].staffLevel.toString();
      }
    }
    return '0';
  }
}

export interface StaffLevel {
  externalId: number;
  id: number;
  label?: string;
  name: string;
  status: string;
  userPositionBonusSystems: any;
}
