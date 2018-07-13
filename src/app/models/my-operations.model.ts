export class MyOperationsModel {
  constructor(public bankAverage: number,
              public bankMin: number,
              public bankmax: number,
              public bankrating: number,
              public userResult: number,
              public firstName: string,
              public groupAverage: number,
              public groupMax: number,
              public groupMin: number,
              public groupRating: number,
              public id: number,
              public lastName: string,
              public product: any,
              public staffId: string,
              public competenceLevel?: any,
              public bonusPoints?: number,
              public bankPercentage?: number,
              public groupPercentage?: number,
              public productName?: string) {
  }
}
