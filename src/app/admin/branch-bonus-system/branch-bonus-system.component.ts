import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BonusSystem } from '../bonus-systems/bonus-systems.component';
import { EvaluationGroup } from '../evaluation-group/evaluation-group.component';

@Component({
  selector: 'app-branch-bonus-system',
  templateUrl: './branch-bonus-system.component.html',
  styleUrls: ['./branch-bonus-system.component.css'],
})
export class BranchBonusSystemComponent implements OnInit {
  bankBranches: Branch[] = [];
  bonusSystems: BonusSystem[] = [];
  tableShown = true;

  constructor(private auth: AuthService) {
    this.getBranches();
    this.getBonusSystems();
  }

  ngOnInit() {
  }

  getBranches() {
    this.auth.getRequest('/branches/all')
      .subscribe(
        (branches: Branch[]) => {
          branches.forEach((b) => {
            this.bankBranches.push(b);
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
  doesBranchContainsSystem(systemId: number, branchId: number): string {
    const branch = this.bankBranches.find(b => b.id === branchId);
    for (let i = 0; i < branch.branchBonusSystemGroups.length; i++) {
      if (branch.branchBonusSystemGroups[i].bonusSystem.id === systemId) {
        return branch.branchBonusSystemGroups[i].evaluationGroup.evaluationLevel.toString();
      }
    }
    return '0';
  }

  updateEvaluationGroup(bonusId: number, evalId: any, brancId: number) {
    this.bankBranches.length = 0;
    this.bonusSystems.length = 0;
    const data = {
      bonusSystemId: bonusId,
      evaluationGroupId: evalId.target.value,
    };
    this.auth.putRequest(data, `/branches/${brancId}/assignEvaluationGroup`)
      .subscribe(
        () => {
          this.tableShown = false;
          this.getBranches();
          this.getBonusSystems();
          this.tableShown = true;
        });
  }
}

export interface Branch {
  branchBonusSystemGroups: BrancBonusSystemGroup[];
  branchId?: number;
  evaluationGroup?: any;
  externalId: number;
  id: number;
  name: string;
  status: string;
  users: any;
}

export interface BrancBonusSystemGroup {
  bonusSystem: BonusSystem;
  enabled: boolean;
  evaluationGroup: EvaluationGroup;
  id: number;
  status: string;
}
