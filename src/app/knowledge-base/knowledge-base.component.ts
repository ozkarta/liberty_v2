import { Component, OnInit, ViewChild } from '@angular/core';
import { LibertyUserModel } from '../models/liberty-user.model';
import { AuthorizedUserService } from '../services/authorized-user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.css'],
})
export class KnowledgeBaseComponent implements OnInit {
  user: LibertyUserModel;
  isFullComents = false;
  commentExpandText: string;
  // displayedColumns = ['name'];
  // bonusSystems: BonusSystem[] = [];
  // dataSource = new MatTableDataSource(this.bonusSystems);
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private currentUser: AuthorizedUserService, private router: Router, private auth: AuthService, public dialog: MatDialog) {
    this.isFullComents = false;
    // this.commentExpandText = 'ყველა კომენტარის ნახვა';
  }

  ngOnInit() {
  }

  checkUserIsAdmin() {
    this.currentUser.getUser
      .subscribe(
        (user: LibertyUserModel) => {
          this.user = user;
          // this.getBonusSystems();
        });
  }

  expandComments() {
    this.isFullComents = !this.isFullComents;
  }

}
