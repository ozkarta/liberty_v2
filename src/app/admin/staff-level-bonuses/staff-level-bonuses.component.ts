import { Component, OnInit } from '@angular/core';
import { NetworkingService } from '../../services/networking.service';
import {BonusSystem} from '../bonus-systems/bonus-systems.component';

@Component({
  selector: 'app-staff-level-bonuses',
  templateUrl: './staff-level-bonuses.component.html',
  styleUrls: ['./staff-level-bonuses.component.css'],
})
export class StaffLevelBonusesComponent implements OnInit {
  staffLevels: StaffLevel[] = [];
  bonusSystems: BonusSystem[] = [];

  constructor(private network: NetworkingService) { }

  ngOnInit() {
    this.getStaffLevels();
    this.getBonusSystems();
  }

  getStaffLevels() {
    this.network.getRequest('/userPositions/allUserPositions')
      .subscribe(
        (staffLevels: StaffLevel[]) => {
          staffLevels.forEach((s) => {
            this.staffLevels.push(s);
          });
        });
  }
  getBonusSystems() {
    this.network.getRequest('/bonusSystems/all')
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
        const retVal = level.userPositionBonusSystems[i].staffLevel;
        if (retVal === 'PERFORMER') {
          return 1;
        }
        if (retVal === 'MIDDLE_MANAGER') {
          return 2;
        }
        if (retVal === 'UPPER_MANAGER') {
          return 3;
        }
      }
    }
    return 0;
  }
  changeStaffLevel(systemId: number, levelId: number, userPositionId: any) {
    const data = {
      bonusSystemId: systemId,
      staffLevelId: userPositionId.value,
    };
    this.network.putRequest(data, `/userPositions/${levelId}/assignBonusSystemAndStaffLevel`)
      .subscribe(
        (response: any) => {
          console.log(response);
        });
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
