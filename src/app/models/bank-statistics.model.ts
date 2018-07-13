export class BankStatisticsModel {
  constructor(public bonusRatingDto: Statistic,
              public saleRatingDto: Statistic) {}
}

export interface Statistic {
  maxPoints: number;
  minPoints: number;
  rating: number;
  mean: number;
  userResult: number;
}
