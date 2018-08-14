import { Component, OnInit, ViewChild } from '@angular/core';
import { networkorizedUserService } from '../../services/authorized-user.service';
import { LibertyUserModel } from '../../models/liberty-user.model';
import { Router } from '@angular/router';
import { NetworkingService } from '../../services/networking.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AddBonusSystemComponent } from '../../dialogs/add-bonus-system/add-bonus-system.component';
import { BonusSystemEditComponent } from '../../dialogs/bonus-system-edit/bonus-system-edit.component';

@Component({
  selector: 'app-bonus-systems',
  templateUrl: './bonus-systems.component.html',
  styleUrls: ['./bonus-systems.component.css'],
})
export class BonusSystemsComponent implements OnInit {
  user: LibertyUserModel;
  displayedColumns = ['name'];
  bonusSystems: BonusSystem[] = [];
  dataSource = new MatTableDataSource(this.bonusSystems);
  @ViewChild(MatSort) sort: MatSort;

  constructor(private currentUser: networkorizedUserService, private router: Router, private network: NetworkingService, public dialog: MatDialog) {
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
            this.getBonusSystems();
          }
        });
  }
  getBonusSystems() {
    this.network.getRequest('/bonusSystems/all')
      .subscribe(
        (response: BonusSystem[]) => {
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
      data: 'bonus',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getBonusSystems();
        this.editBonusSystem(result);
      }
    });
  }
  editBonusSystem(id: number) {
    const dialogRef = this.dialog.open(BonusSystemEditComponent, {
      width: '50vw',
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getBonusSystems();
    });
  }
}

export interface BonusSystem {
  id: number;
  name: string;
  status: string;
}
