import { Injectable } from '@angular/core';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

enum AlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success',
}

@Injectable({
  providedIn: 'root',
})
export class AlertModalService {
  constructor(private modalService: BsModalService) { }

  showAlertDanger(message: string) {
    this.showAlert(message, AlertTypes.DANGER);
  }

  showAlertSuccesso(message: string) {
    this.showAlert(message, AlertTypes.SUCCESS, 3000);
  }

  private showAlert(
    message: string,
    type: AlertTypes,
    dismissTimeout?: number
  ) {
    const bsModalRef: BsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.type = type;
    bsModalRef.content.message = message;

    if (dismissTimeout) {
      setTimeout(() => bsModalRef.hide(), dismissTimeout);
    }
  }

  showConfirm(title: string, msg: string, okTxt?: string, cancelTxt?: string) {
    const bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent);

    const confirmModal = (bsModalRef.content as ConfirmModalComponent);

    confirmModal.title = title;
    confirmModal.msg = msg;

    if (okTxt) {
      confirmModal.okTxt = okTxt;
    }

    if (cancelTxt) {
      confirmModal.cancelTxt = cancelTxt;
    }

    return confirmModal.confirmResult;
  }
}
