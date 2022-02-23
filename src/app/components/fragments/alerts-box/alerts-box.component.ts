import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertTypes } from 'src/app/enums/all.enums';
import { IAlert } from 'src/app/interfaces/alert.interface';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alerts-box',
  templateUrl: './alerts-box.component.html',
  styleUrls: ['./alerts-box.component.scss']
})
export class AlertsBoxComponent implements OnInit {
  alertsList: IAlert[] = [];
  alert?: IAlert;
  AlertTypes = AlertTypes;

  subscription: Subscription | undefined;
  TIMEOUT_DURATION = 1000 * 5;

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.subscription = this.alertService.getObservabe().subscribe((alert: IAlert) => {
      this.alertsList.push(alert);
      if (!this.alert) {
        this.shiftAlert();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  shiftAlert() {
    this.alert = this.alertsList.shift();
    if (this.alert && this.alert.autoClose) {
      setTimeout(() => {
        this.shiftAlert();
      }, this.TIMEOUT_DURATION);
    }
  }
}
