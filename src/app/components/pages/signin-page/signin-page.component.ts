import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IFormTextInputConfig } from 'src/app/interfaces/_common.interface';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';



@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss']
})
export class SigninPageComponent implements OnInit {

  formInputs: IFormTextInputConfig[] = [
    { inputLabel: `Email or Username`, controlName: `email_or_username`, inputType: `email`, validators: [Validators.required] },
    { inputLabel: `Password`, controlName: `password`, inputType: `password`, validators: [Validators.required] },
  ];
  loading: boolean = false;
  signinForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private alertService: AlertService,
  ) {
    const signinFormObj: { [key:string]: FormControl } = {};
    for (const ctrl of this.formInputs) {
      const control = new FormControl(ctrl.initialValue || '', ctrl.validators);
      signinFormObj[ctrl.controlName] = control;
    }
    this.signinForm = new FormGroup(signinFormObj);
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.signinForm.invalid) {
      return;
    }
    this.loading = true;
    this.usersService.sign_in(this.signinForm.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.alertService.showSuccessMessage(response.message!, true);
          this.router.navigate(['/', 'users', response.data.you.id]);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.showErrorMessage(error.error.message, true);
        }
      });
  }
}