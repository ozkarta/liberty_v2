import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { OtherUserService } from '../services/other-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  id: number;

  constructor(@Inject(MAT_DIALOG_DATA) data,
              private auth: AuthService,
              private other: OtherUserService,
              private router: Router,
              private dialogRef: MatDialogRef<DialogComponent>) {
    this.id = data.userId;
  }

  ngOnInit() {
    this.auth.getRequest(`/bonusRewards/getUserData/${this.id}`)
      .subscribe(
        (response: any) => {
          console.log(response);
        });
  }

  getUser(id: number) {
    this.other.setUserId(id);
    this.router.navigate([`others/${id}`]);
    this.dialogRef.close();
  }
}
