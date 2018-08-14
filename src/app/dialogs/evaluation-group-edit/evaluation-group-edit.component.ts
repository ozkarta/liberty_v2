import {Component, Inject, OnInit} from '@angular/core';
import {AddBonusSystemComponent} from '../add-bonus-system/add-bonus-system.component';
import {NetworkingService} from '../../services/networking.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EvaluationGroup} from '../../admin/evaluation-group/evaluation-group.component';

@Component({
  selector: 'app-evaluation-group-edit',
  templateUrl: './evaluation-group-edit.component.html',
  styleUrls: ['./evaluation-group-edit.component.css'],
})
export class EvaluationGroupEditComponent implements OnInit {
  group: EvaluationGroup;
  dataAvaible = false;

  constructor(public dialogRef: MatDialogRef<AddBonusSystemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private network: NetworkingService) { }

  ngOnInit() {
    this.network.getRequest(`/evaluationGroups/${this.data}`)
      .subscribe(
        (group: EvaluationGroup) => {
          this.group = group;
          this.dataAvaible = true;
        });
  }

  changeGroupName() {
    this.network.putRequest(this.group, `/evaluationGroups/editEvaluationGroup`)
      .subscribe(
        (response: any) => {
          this.dialogRef.close(true);
        });

  }

}
