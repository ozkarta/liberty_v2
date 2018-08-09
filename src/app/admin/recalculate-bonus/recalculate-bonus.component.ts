import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recalculate-bonus',
  templateUrl: './recalculate-bonus.component.html',
  styleUrls: ['./recalculate-bonus.component.css'],
})
export class RecalculateBonusComponent implements OnInit {
  calculationInProgress = false;
  currentProgress = 0;
  timer: any;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.getCurrentProgress();
  }

  recalculateBonuses() {
    this.calculationInProgress = true;
    this.auth.postRequest(null, '/bonusRewards/recalculateBonuses')
      .subscribe(
        (response: any) => {
        });
    setTimeout(() => {
      this.getCurrentProgress();
    },         5000);
  }
  getCurrentProgress() {
    this.auth.getRequest('/bonusRewards/getBonusRecalculationProgress')
      .subscribe(
        (progress: number) => {
          this.currentProgress = progress;
          if (progress === 0 || progress === null) {
            this.calculationInProgress = false;
            return;
          }
          if (progress !== 0) {
            this.calculationInProgress = true;
            setTimeout(() => {
              this.getCurrentProgress();
            },         10000);
          }
        });
  }
}
