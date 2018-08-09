import { Component, OnInit, ViewChild } from '@angular/core';
import { LibertyUserModel } from '../../models/liberty-user.model';
import { BonusSystem } from '../bonus-systems/bonus-systems.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AddBonusSystemComponent } from '../../dialogs/add-bonus-system/add-bonus-system.component';
import { AuthorizedUserService } from '../../services/authorized-user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {EvaluationGroupEditComponent} from '../../dialogs/evaluation-group-edit/evaluation-group-edit.component';

@Component({
  selector: 'app-evaluation-group',
  templateUrl: './evaluation-group.component.html',
  styleUrls: ['./evaluation-group.component.css'],
})
export class EvaluationGroupComponent implements OnInit {
  user: LibertyUserModel;
  displayedColumns = ['name', 'groupNumber'];
  bonusSystems: EvaluationGroup[] = [];
  dataSource = new MatTableDataSource(this.bonusSystems);
  @ViewChild(MatSort) sort: MatSort;

  constructor(private currentUser: AuthorizedUserService, private router: Router, private auth: AuthService, public dialog: MatDialog) {
    this.checkUserIsAdmin();
  }

  ngOnInit() {
  }

  checkUserIsAdmin() {
    this.currentUser.getUser
      .subscribe(
        (user: LibertyUserModel) => {
          if (user && !user.isAdmin) {
            this.router.navigate(['profile']);
          } else {
            this.user = user;
            this.getEvaluationGroups();
          }
        });
  }
  getEvaluationGroups() {
    this.auth.getRequest('/evaluationGroups/all')
      .subscribe(
        (response: EvaluationGroup[]) => {
          this.bonusSystems.length = 0;
          response.forEach((b) => {
            this.bonusSystems.push(b);
          });
          this.dataSource.sort = this.sort;
        });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddBonusSystemComponent, {
      width: '500px',
      data: 'evaluation',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getEvaluationGroups();
      }
    });
  }
  editEvaluationGroup(id: number) {
    const dialog = this.dialog.open(EvaluationGroupEditComponent, {
      width: '500px',
      data: id,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.getEvaluationGroups();
      }
    });
  }
}

export interface EvaluationGroup {
  evaluationLevel?: number;
  id: number;
  name: string;
  status: string;
}
