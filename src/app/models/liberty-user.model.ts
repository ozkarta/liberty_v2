export class LibertyUserModel {
  constructor(public email: string,
              public firstName: string,
              public id: number,
              public lastName: string,
              public userPosition: string,
              public userStaffLevel: string,
              public profilePicture?: string,
              public authorities?: any,
              public isAdmin?: boolean) {
  }
}
