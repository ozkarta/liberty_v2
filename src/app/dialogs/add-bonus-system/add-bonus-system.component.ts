import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { NetworkingService } from '../../services/networking.service';
import { BonusSystem } from '../../product-add-dialog/product-add-dialog.component';
import { EvaluationGroup } from '../../admin/evaluation-group/evaluation-group.component';

@Component({
  selector: 'app-add-bonus-system',
  templateUrl: './add-bonus-system.component.html',
  styleUrls: ['./add-bonus-system.component.css'],
})
export class AddBonusSystemComponent implements OnInit {
  @ViewChild('systemName') systemName: ElementRef;
  @ViewChild('systemNumber') systemNumber: ElementRef;
  name = new FormControl();
  number = new FormControl();

  constructor(public dialogRef: MatDialogRef<AddBonusSystemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string, private network: NetworkingService) {
  }

  ngOnInit() {
  }

  addSystem() {
    let data;
    let url = '';
    if (this.systemName.nativeElement.value !== '') {
      if (this.data === 'bonus') {
        data = {
          name: this.systemName.nativeElement.value,
        };
      } else {
        data = {
          name: this.systemName.nativeElement.value,
          evaluationLevel: this.systemNumber.nativeElement.value,
        };
      }
      if (this.data === 'bonus') {
        url = '/bonusSystems/add';
      } else {
        url = '/evaluationGroups/add';
      }
      if (this.data !== 'bonus') {
        this.network.getRequest('/evaluationGroups/all')
          .subscribe(
            (response: EvaluationGroup[]) => {
              response.forEach((b) => {
                if (b.evaluationLevel.toString() === this.systemNumber.nativeElement.value) {
                  this.number.setErrors({ notUnique: true });
                  return;
                }
              });
            });
      }
      this.network.postRequest(data, url)
        .subscribe(
          (system: BonusSystem) => {
            this.dialogRef.close(system.id);
          });

    } else {
      this.name.setErrors({ nameEmpty: true });
    }
  }

  getErrorMessage() {
    return this.name.hasError('nameEmpty') ? 'მოითითეთ სახელი' : '';
  }

  getNumberErrorMessage() {
    return this.name.hasError('notUnique') ? 'პოზიცია უნდა იყოს უნიკალური' : '';
  }
}
