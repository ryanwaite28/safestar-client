import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PlainObject } from 'src/app/interfaces/json-object.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ClientService } from 'src/app/services/client.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';
import { capitalize } from 'src/app/_misc/chamber';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.scss']
})
export class UserSettingsPageComponent implements OnInit {
  you: IUser | null;
  loading: boolean = false;
  initState = false;
  infoData: PlainObject = {};
  locationInfo: PlainObject = {};
  loadingPath = '';

  verification_requested_successfully: boolean = false;
  phone_is_verified: boolean = false;
  sms_request_id?: string;
  sms_results: any;
  
  // forms

  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  TEXT_INV_PRT_LIMIT = 500;

  userInfoForm = new FormGroup({
    email: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    // phone: new FormControl('', [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{10,11}$/g)]),
    username: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    bio: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    is_public: new FormControl(false, []),
    allow_messaging: new FormControl(false, []),
    allow_conversations: new FormControl(false, []),
  });

  userPasswordForm = new FormGroup({
    currentPassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    password: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    confirmPassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
  });

  phoneForm = new FormGroup({
    phone: new FormControl('', [Validators.pattern(/^[\d]+$/), Validators.minLength(10), Validators.maxLength(10)]),
  });
  phoneVerifyForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
  });

  userIconForm = new FormGroup({
    file: new FormControl(null),
  });

  userWallpaperForm = new FormGroup({
    file: new FormControl(null),
  });

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private alertService: AlertService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.initSettings(you);
      }
    });
  }

  initSettings(you: IUser | null) {
    this.you = you;
    this.setFormsInitialState();
  }

  setFormsInitialState() {
    if (this.you && !this.initState) {
      this.initState = true;

      this.userInfoForm.setValue({
        email: this.you.email,
        // phone: this.you.phone,
        username: this.you.username,
        bio: this.you.bio,
        is_public: this.you.is_public,
        allow_messaging: this.you.allow_messaging,
        allow_conversations: this.you.allow_conversations,
      });
    }
  }

  handleResponseError(error: HttpErrorResponse) {
    this.alertService.showErrorMessage(error.error.message, true);
    this.loading = false;
  }

  /** on submit methods */

  onSubmitUserInfoForm() {
    const data = {
      ...this.userInfoForm.value,
      // ...this.phoneForm.value,

      // phone_is_verified: this.phone_is_verified,
      // sms_results: this.sms_results,
    };

    this.loading = true;
    this.usersService.update_info(this.you!.id, data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (response) => {
          this.alertService.showSuccessMessage(response.message!, true);
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserPasswordForm() {
    this.loading = true;
    this.usersService.update_password(this.you!.id, this.userPasswordForm.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (response) => {
          this.alertService.showSuccessMessage(response.message!);
          this.userPasswordForm.reset({
            currentPassword: '',
            password: '',
            confirmPassword: '',
          });
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserIconForm(
    userIconFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    // console.log({ userIconFormElm, fileInput });
    const formData = new FormData(userIconFormElm);
    const file = !!fileInput && !!fileInput.files && fileInput.files[0];
    if (!file) {
      const ask = window.confirm(
        `No file was found. Do you want to clear your icon?`
      );
      if (!ask) {
        return;
      }
    }
    formData.append('should_delete', 'true');
    this.loading = true;
    this.usersService.update_icon(this.you!.id, formData)
      .subscribe(
        (response) => {
          this.alertService.showSuccessMessage(response.message!);
          this.userIconForm.reset();
          if (fileInput) {
            fileInput.value = '';
          }
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserWallpaperForm(
    userWallpaperFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    // console.log({ userWallpaperFormElm, fileInput });
    const formData = new FormData(userWallpaperFormElm);
    const file = !!fileInput && !!fileInput.files && fileInput.files[0];
    if (!file) {
      const ask = window.confirm(
        `No file was found. Do you want to clear your wallpaper?`
      );
      if (!ask) {
        return;
      }
    }
    formData.append('should_delete', 'true');
    this.loading = true;
    this.usersService.update_wallpaper(this.you!.id, formData)
      .subscribe(
        (response) => {
          this.alertService.showSuccessMessage(response.message!);
          this.userWallpaperForm.reset();
          if (fileInput) {
            fileInput.value = '';
          }
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.handleResponseError(error);
        }
      );
  }

  send_sms_verification() {
    const phone = this.phoneForm.value.phone 
      ? `1` + this.phoneForm.value.phone
      : 'x';

    this.loading = true;
    if (phone === 'x') {
      const ask = window.confirm(`The phone input was blank. Remove phone from your account?`);
      if (!ask) {
        this.loading = false;
        return;
      }
      this.usersService.send_sms_verification(phone)
        .subscribe(
          (response: any) => {
            this.loading = false;
            window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
            this.userStore.setState(response.data.you);
            this.verification_requested_successfully = false;
            this.sms_results = undefined;
            this.sms_request_id = undefined;
          },
          (error: HttpErrorResponse) => {
            this.loading = false;
            this.handleResponseError(error);
          }
        );
      return;
    }

    this.usersService.send_sms_verification(phone)
      .subscribe(
        (response: any) => {
          this.verification_requested_successfully = true;
          this.sms_results = response.data.sms_results;
          this.sms_request_id = response.data.sms_request_id;
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
          this.loading = false;
        }
      );
  }

  verify_sms_code() {
    this.loading = true;
    this.usersService.verify_sms_code({
      request_id: this.sms_request_id!,
      code: this.phoneVerifyForm.value.code,
    }).subscribe(
      (response: any) => {
        this.loading = false;
        this.phone_is_verified = true;
        this.alertService.showSuccessMessage(response.message!, true);
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.handleResponseError(error);
      }
    );
  }
}
