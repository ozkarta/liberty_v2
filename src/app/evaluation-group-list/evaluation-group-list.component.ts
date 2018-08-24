import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NetworkingService} from '../services/networking.service';

@Component({
  selector: 'app-evaluation-group-list',
  templateUrl: './evaluation-group-list.component.html',
  styleUrls: ['./evaluation-group-list.component.css']
})
export class EvaluationGroupListComponent implements OnInit {
  branches: any[] = [];
  displayedColumns = ['name'];
  dataLoaded = false;

  constructor(private route: ActivatedRoute, private network: NetworkingService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (param: any) => {
          this.getEvaluationGroups(param.id);
        });
  }

  getEvaluationGroups(id: number) {
    this.network.getRequest(`/branches/branchesByGroup?groupId=${id}`)
      .subscribe(
        (response: any[]) => {
          response.forEach((b) => {
            this.branches.push(b);
          });
          this.dataLoaded = true;
          console.log(this.branches);
        });
  }

}
