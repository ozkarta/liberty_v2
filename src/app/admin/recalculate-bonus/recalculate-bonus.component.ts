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
          this.calculationInProgress = false;
          this.getCurrentProgress();
        });
  }
  getCurrentProgress() {
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    this.auth.getRequest('/bonusRewards/getBonusRecalculationProgress')
      .subscribe(
        (progress: number) => {
          this.currentProgress = progress;
          if (progress !== 0) {
            this.calculationInProgress = true;
            this.timer = setTimeout(this.getCurrentProgress(), 10000);
          }
          if (progress === 0) {
            this.calculationInProgress = false;
          }
        });
  }
}
