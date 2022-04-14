import { Injectable } from '@angular/core';

@Injectable()
export class GlobalFunction {
  showSuccessToast(toastr: any, message: any) {
    toastr.success(message, 'Success', {
      timeOut: 3000
    });
  }

  showErrorToast(toastr: any, message: any) {
    toastr.error(message, 'Error', {
      timeOut: 3000
    });
  }

  showWarningToast(toastr: any, message: any) {
    toastr.warning(message, 'Warning', {
      timeOut: 3000
    });
  }
}
