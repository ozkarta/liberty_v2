export class UserModel {
  constructor(public bankCurrentMonthMean?: number,
              public bonusByCurrentMonth?: number,
              public bonusByYear?: number,
              public firstName?: string,
              public highestCurrentMonth?: number,
              public lastName?: string,
              public productsBonusByMonth?: any,
              public productsBonusByYear?: any,
              public prorductsBonusesByMonths?: any,
              public email?: string,
              public mobile?: string) {
  }

}
export interface SummerProductData {
  name?: string;
  value?: number;
}

export interface LastTwoMonthBonuses {
  name: string;
  currentMonth: number;
  previousMonth: number;
  saleQuantity?: number;
  bankMax: number;
  percentage: number;
}
