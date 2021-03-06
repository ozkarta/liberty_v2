import { Component, OnInit } from '@angular/core';
import { NetworkingService } from '../../services/networking.service';

@Component({
  selector: 'app-additional-parameters',
  templateUrl: './additional-parameters.component.html',
  styleUrls: ['./additional-parameters.component.css'],
})
export class AdditionalParametersComponent implements OnInit {
  parameters: Params;

  constructor(private network: NetworkingService) {
  }

  ngOnInit() {
    this.network.getRequest('/bonusRewards/additionalParameters')
      .subscribe(
        (parameters: Params) => {
          this.parameters = parameters;
        });
  }

  updateCommercialParticipation() {
    const data = {
      typeId: this.parameters.commercialParticipation.typeId,
      value: this.parameters.commercialParticipation.value,
    };
    this.network.putRequest(data , '/bonusRewards/updateAdditionalParameter')
      .subscribe((response: any) => {
        console.log(response);
      });

  }

  updateRoundingIndex() {
    const data = {
      typeId: this.parameters.roundingIndex.typeId,
      value: this.parameters.roundingIndex.value,
    };
    this.network.putRequest(data , '/bonusRewards/updateAdditionalParameter')
      .subscribe((response: any) => {
        console.log(response);
      });
  }
}

export interface Params {
  commercialParticipation: {
    type: string,
    typeId: number,
    value: number,
  };
  roundingIndex: {
    type: string,
    typeId: number,
    value: number,
  };
}
