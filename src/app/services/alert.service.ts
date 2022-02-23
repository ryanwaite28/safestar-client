import { Injectable } from '@angular/core';
import { IAlert } from '../interfaces/alert.interface';
import { Subject } from 'rxjs';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { copyObj } from '../_misc/clone-object';
import { AlertTypes } from '../enums/all.enums';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // private alertsList: IAlert[] = [];
  private newAlert = new Subject<IAlert>();

  AlertTypes = AlertTypes;

  constructor() { }

  getObservabe() {
    const observable = this.newAlert.asObservable();
    return observable;
  }

  // getList() {
  //   const copy = copyObj(this.alertsList);
  //   return copy as IAlert[];
  // }

  private addAlert(alertObj: IAlert) {
    if (!alertObj) {
      console.warn(`No alert arg given...`);
      return;
    }
    // this.alertsList.push(alertObj);
    this.newAlert.next(alertObj);
  }

  // removeAlert(removeAlert: IAlert) {
  //   if (!removeAlert) {
  //     console.warn(`No alert arg given...`);
  //     return;
  //   }
  //   const index = this.alertsList.findIndex((alert: IAlert) => alert.timestamp === removeAlert.timestamp);
  //   const resultFound = index > -1;
  //   if (resultFound) {
  //     this.alertsList.splice(index, 1);
  //   }
  // }

  showSuccessMessage(message?: string, autoClose: boolean = false) {
    if (!message) {
      console.warn(`No message arg given...`);
      return;
    }
    this.addAlert({
      timestamp: Date.now(),
      type: this.AlertTypes.SUCCESS,
      message,
      autoClose,
    });
  }

  showErrorMessage(message?: string, autoClose: boolean = false) {
    if (!message) {
      console.warn(`No message arg given...`);
      return;
    }
    this.addAlert({
      timestamp: Date.now(),
      type: this.AlertTypes.DANGER,
      message,
      autoClose,
    });
  }

  showWarningMessage(message: string, autoClose: boolean = false) {
    if (!message) {
      console.warn(`No message arg given...`);
      return;
    }
    this.addAlert({
      timestamp: Date.now(),
      type: this.AlertTypes.WARNING,
      message,
      autoClose,
    });
  }

  handleResponseSuccessGeneric(response: { message: string }, autoClose: boolean = false) {
    if (!response || !response.message) {
      return;
    }
    this.addAlert({
      timestamp: Date.now(),
      type: this.AlertTypes.SUCCESS,
      message: response.message,
      autoClose,
    });
  }

  handleResponseErrorGeneric(error: HttpErrorResponse, autoClose: boolean = false) {
    if (!error || !error.error.message) {
      return;
    }
    this.addAlert({
      timestamp: Date.now(),
      type: this.AlertTypes.DANGER,
      message: error.error.message,
      autoClose,
    });
  }
}
