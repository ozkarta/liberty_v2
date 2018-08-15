// import { ErrorHandler, Injectable, Injector } from '@angular/core';
// import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
// import { HttpErrorResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';
// // Cool library to deal with errors: https://www.stacktracejs.com
// // import * as StackTraceParser from 'error-stack-parser';
//
// @Injectable()
// export class ErrorsService {
//   constructor(private injector: Injector) {
//   }
//
//   log(error) {
//     // Log the error to the console
//     console.error(error);
//     // Send error to server
//     const errorToSend = this.addContextInfo(error);
//     return fakeHttpService.post(errorToSend);
//   }
//
//   // addContextInfo(error) {
//   //   // All the context details that you want (usually coming from other services; Constants, UserService...)
//   //   const name = error.name || null;
//   //   const appId = 'shthppnsApp';
//   //   const user = 'ShthppnsUser';
//   //   const time = new Date().getTime();
//   //   const id = `${appId}-${user}-${time}`;
//   //   const location = this.injector.get(LocationStrategy);
//   //   const url = location instanceof PathLocationStrategy ? location.path() : '';
//   //   const status = error.status || null;
//   //   const message = error.message || error.toString();
//   //   const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
//   //   const errorToSend = {name, appId, user, time, id, url, status, message, stack};
//   //   return errorToSend;
//   // }
// }
