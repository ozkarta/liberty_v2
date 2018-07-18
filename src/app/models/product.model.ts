import { BonusSystem } from '../admin/bonus-systems/bonus-systems.component';

export class ProductModel {
  constructor(public bonusPoints: number,
              public bonusSystem: BonusSystem,
              public externalId: number,
              public id: number,
              public name: string,
              public primary: boolean,
              public productMotivationalBlockType: string,
              public productMotivationalBlockTypeId: number,
              public sortOrder: number,
              public status: string,
              public bonusSystemId?: number,
              public documentUId?: number,
              public productCode?: number) {
  }
}
