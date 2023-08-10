import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from './error-handler.service';
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}
  handleError(error: any): void {
    const handler = this.injector.get(ErrorHandlerService);
    console.error(error);
    handler.handleError({
      message: 'Error ' + error,
      status: 0,
      context: 'App error handler',
      error: error,
    });
    //throw new Error('Method not implemented.');
  }
}
