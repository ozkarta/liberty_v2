import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelect } from '@angular/material';
import { NetworkingService } from '../../services/networking.service';
import { AddBonusSystemComponent } from '../add-bonus-system/add-bonus-system.component';
import { BonusSystem } from '../../product-add-dialog/product-add-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-bonus-system-edit',
  templateUrl: './bonus-system-edit.component.html',
  styleUrls: ['./bonus-system-edit.component.css'],
})
export class BonusSystemEditComponent implements OnInit {
  bonusSystemForEdit: ManagerBonusSystem[] = [];
  @ViewChild('firstSelect') firstSelect: MatSelect;
  @ViewChild('secondSelect') secondSelect: MatSelect;
  @ViewChild('thirdSelect') thirdSelect: MatSelect;
  @ViewChild('fourthSelect') fourthSelect: MatSelect;
  secondSelectControl = new FormControl();
  fourthSelectControl = new FormControl();

  @ViewChild('firstInput') firstInput: ElementRef;
  @ViewChild('secondInput') secondInput: ElementRef;

  @ViewChild('systemName') systemName: ElementRef;

  editTitle = false;

  constructor(public dialogRef: MatDialogRef<BonusSystemEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number, private network: NetworkingService) {
  }

  ngOnInit() {
    this.getBonusSystem();
  }

  getBonusSystem() {
    this.network.getRequest(`/bonusSystems/getStaffLevelBonusSystems?bonusSystemId=${this.data}`)
      .subscribe(
        (response: ManagerBonusSystem[]) => {
          response.forEach((s) => {
            this.bonusSystemForEdit.push(s);
          });
        });
  }

  secondSelectChanged(event: any) {
    if (event.value === 0) {
      return;
    }
    if (event.value !== 1) {
      this.fourthSelect.value = 1;
    } else {
      this.fourthSelect.value = this.fourthSelect.options.find(o => o.value !== 1 && o.value !== 0).value;
    }
  }

  fourthSelectChanged(event: any) {
    if (event.value === 0) {
      return;
    }
    if (event.value !== 1) {
      this.secondSelect.value = 1;
    } else {
      this.secondSelect.value = this.secondSelect.options.find(o => o.value !== 1 && o.value !== 0).value;
    }
  }

  editBonusSystem() {
    if (this.secondSelect.value === 0 || this.fourthSelect.value === 0) {
      if (this.secondSelect.value === 0) {
        this.secondSelectControl.setErrors({ invalidSelect: true });
      }
      if (this.fourthSelect.value) {
        this.fourthSelectControl.setErrors({ invalidSelect: true });
      }
      return;
    }

    const data: any = [{
      bonusSystem: this.bonusSystemForEdit[0].bonusSystem,
      id: this.bonusSystemForEdit[0].id,
      percentShare: this.firstInput.nativeElement.value / 100,
      staffLevel: this.firstSelect.value === 2 ? 'MIDDLE_MANAGER' : 'UPPER_MANAGER',
      staffLevelBase: this.secondSelect.value === 2 ? 'MIDDLE_MANAGER' : this.secondSelect.value === 1 ? 'PERFORMER' : 'UPPER_MANAGER',
      status: 'ACTIVE',
    },
      {
        bonusSystem: this.bonusSystemForEdit[1].bonusSystem,
        id: this.bonusSystemForEdit[1].id,
        percentShare: this.secondInput.nativeElement.value / 100,
        staffLevel: this.thirdSelect.value === 2 ? 'MIDDLE_MANAGER' : 'UPPER_MANAGER',
        staffLevelBase: this.fourthSelect.value === 2 ? 'MIDDLE_MANAGER' : this.fourthSelect.value === 1 ? 'PERFORMER' : 'UPPER_MANAGER',
        status: 'ACTIVE',
      },
    ];
    this.network.putRequest(data, '/bonusSystems/editStaffLevelBonusSystems')
      .subscribe(
        () => {
          this.dialogRef.close();
        });
  }

  editSystemName() {
    const data = {
      id: this.bonusSystemForEdit[0].bonusSystem.id,
      name: this.systemName.nativeElement.textContent,
    };
    this.network.putRequest(data, '/bonusSystems/editBonusSystem')
      .subscribe(
        (response: BonusSystem) => {
          this.bonusSystemForEdit[0].bonusSystem.name = response.name;
          this.editTitle = !this.editTitle;
          this.getBonusSystem();
        });
  }

}

export interface ManagerBonusSystem {
  bonusSystem: BonusSystem;
  id: number;
  percentShare: number;
  staffLevel: string;
  staffLevelBase: string;
  status: string;
}
