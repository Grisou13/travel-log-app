import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export type ErrorMessage = { message: string; status: any; context: string };
@Injectable()
export class ErrorHandlerService {
  constructor(private toastr: ToastrService) {}
  handleError(error: ErrorMessage): void {
    console.error(error);
    this.toastr.error(error.message);
    //throw new Error('Method not implemented.');
  }
}
