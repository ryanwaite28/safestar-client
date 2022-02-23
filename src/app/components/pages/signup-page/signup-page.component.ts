import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IFormTextInputConfig } from 'src/app/interfaces/_common.interface';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';



@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  formInputs: IFormTextInputConfig[] = [
    { inputLabel: `First Name`, controlName: `firstname`, inputType: `text`, validators: [Validators.required] },
    { inputLabel: `Middle Name (Optional)`, controlName: `middlename`, inputType: `text`, validators: [] },
    { inputLabel: `Last Name`, controlName: `lastname`, inputType: `text`, validators: [Validators.required] },
    { inputLabel: `Username`, controlName: `username`, inputType: `text`, validators: [Validators.required] },
    { inputLabel: `Email`, controlName: `email`, inputType: `email`, validators: [Validators.required] },
    { inputLabel: `Password`, controlName: `password`, inputType: `password`, validators: [Validators.required] },
    { inputLabel: `Confirm Password`, controlName: `confirmPassword`, inputType: `password`, validators: [Validators.required] },
  ];
  loading: boolean = false;
  signupForm: FormGroup;

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
    this.signupForm = new FormGroup(signinFormObj);
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }
    this.loading = true;
    this.usersService.sign_up(this.signupForm.value)
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
