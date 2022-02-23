import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { first, flatMap, map, share, single, take } from 'rxjs/operators';
import {
  SignUpResponse,
  SignInResponse,
  GenericApiResponse,
  GetVerifySmsCode,
} from '../interfaces/responses.interface';
import {
  PlainObject
} from '../interfaces/json-object.interface';
import { UserStoreService } from '../stores/user-store.service';
import { INotification } from '../interfaces/notification.interface';
import { IUserField } from '../interfaces/user-field.interface';
import { MODERN_APPS, USER_RECORDS } from '../enums/all.enums';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { UtilityService } from './utility.service';
import { IApiKey } from '../interfaces/_common.interface';
import { JWT_NAME } from '../_misc/vault';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  session: GenericApiResponse | any;
  sessionChecked: boolean = false;

  constructor(
    private userStore: UserStoreService,
    private clientService: ClientService,
    private utilityService: UtilityService
  ) {}

  private isFirstCall = true;

  checkUserSession() {
    return this.userStore.getChangesObs().pipe(
      flatMap((you: IUser | null) => {
        return you !== undefined
          ? of(you)
          : this.checkSession().pipe(
              map((response: GenericApiResponse) => {
                return response.data.you || null;
              })
            );
      })
    );
  }

  private checkSession() {
    const jwt = window.localStorage.getItem(JWT_NAME);
    if (!jwt || jwt === `undefined` || !this.utilityService.isJwtFormat(jwt)) {
      window.localStorage.removeItem(JWT_NAME);
      this.userStore.setState(null);
      return of(<GenericApiResponse> {
        message: `no token found`,
        data: {
          online: false,
          you: null,
          token: null,
        }
      });
    }
    return this.clientService.sendRequest<any>(
      '/users/check-session',
      `GET`,
      null,
    ).pipe(
      map((response) => {
        this.session = response;
        this.sessionChecked = true;
        this.userStore.setState(response.data!.you);
        return response;
      })
    );
  }

  sign_out() {
    return of().pipe(
      map(() => {
        this.sign_out_sync();
      })
    );
  }

  sign_out_sync() {
    window.localStorage.removeItem(JWT_NAME);
    this.userStore.setState(null);
    console.log(`signed out`);
  }

  verify_email(uuid: string): Observable<GenericApiResponse> {
    const endpoint = '/users/verify-email/' + uuid;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `GET`).pipe(
      map((response) => {
        this.userStore.setState(null);
        window.localStorage.removeItem(JWT_NAME);
        return response;
      })
    );
  }

  send_sms_verification(phone: string): Observable<GenericApiResponse> {
    const endpoint = '/users/send-sms-verification/' + phone;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verify_sms_code(params: {
    request_id: string,
    code: string,
  }): Observable<GetVerifySmsCode> {
    const { request_id, code } = params;
    const endpoint = `/users/verify-sms-code/request_id/${request_id}/code/${code}`;
    return this.clientService.sendRequest<GetVerifySmsCode>(endpoint, `GET`).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  send_feedback(you_id: number, data: PlainObject) {
    const endpoint = `/users/${you_id}/feedback`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** */

  get_user_by_id(id: number) {
    const endpoint = '/users/id/' + id;
    return this.clientService.sendRequest<IUser>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_home_page_stats(id: number) {
    const endpoint = `/users/${id}/home-stats`;
    return this.clientService.sendRequest<PlainObject<number>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_by_phone(phone: string) {
    const endpoint = '/users/phone/' + phone;
    return this.clientService.sendRequest<IUser>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followers_count(user_id: number) {
    const endpoint = `/users/${user_id}/followers-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followings_count(user_id: number) {
    const endpoint = `/users/${user_id}/followings-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messagings(you_id: number, messagings_timestamp?: string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/users/' + you_id + '/messagings/all'
      : messagings_timestamp
        ? '/users/' + you_id + '/messagings/' + messagings_timestamp
        : '/users/' + you_id + '/messagings';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messages(you_id: number, user_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/users/' + you_id + '/messages/' + user_id + '/' + min_id
      : '/users/' + you_id + '/messages/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_unseen_counts(you_id: number) {
    const endpoint = `/users/${you_id}/unseen-counts`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_api_key(you_id: number) {
    const endpoint = `/users/${you_id}/api-key`;
    return this.clientService.sendRequest<IApiKey>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  find_users_by_name(query_term: string) {
    const endpoint = `/find/users/name?query_term=${query_term}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  find_users_by_username(query_term: string) {
    const endpoint = `/find/users/username?query_term=${query_term}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  find_users_by_name_or_username(query_term: string) {
    const endpoint = `/find/users/name-or-username?query_term=${query_term}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // generic

  get_user_records<T>(
    user_id: number,
    path: USER_RECORDS,
    min_id?: number,
    get_all: boolean = false,
    is_public: boolean = true
  ) {
    const partial_prefix = is_public ? '/get-' : '/';
    const endpoint = get_all
      ? '/users/' + user_id + partial_prefix + path + '/all'
      : min_id
        ? '/users/' + user_id + `${partial_prefix}` + path + '/' + min_id
        : '/users/' + user_id + `${partial_prefix}` + path;
    return this.clientService.sendRequest<GenericApiResponse<T>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_random_models(
    you_id: number,
    model_name: string,
    industry: string = '',
    gallup_strength: string = '',
    pred_ref_profile: string = '',
    cause: string = '',
  ) {
    const endpoint = `/users/${you_id}/random?model_name=${model_name}&industry=${industry}&gallup_strength=${gallup_strength}&pred_ref_profile=${pred_ref_profile}&cause=${cause}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_feed(you_id: number, feed_type: string, min_id?: number) {
    const endpoint = min_id
      ? `/users/${you_id}/feed/${min_id}?feed_type=${feed_type}`
      : `/users/${you_id}/feed?feed_type=${feed_type}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //

  getUserNotificationsAll<T = any>(user_id: number) {
    return this.get_user_records<T>(
      user_id,
      USER_RECORDS.NOTIFICATIONS,
      undefined,
      true,
      false
    );
  }

  getUserNotifications<T = any>(user_id: number, min_id?: number) {
    return this.get_user_records<T>(
      user_id,
      USER_RECORDS.NOTIFICATIONS,
      min_id,
      false,
      false
    );
  }

  /** POST */

  sign_up(data: PlainObject) {
    return this.clientService.sendRequest<any>('/users', `POST`, data).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  create_user_field(id: number, data: PlainObject) {
    return this.clientService.sendRequest<GenericApiResponse<IUserField>>(`/users/${id}/user-field`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  follow_user(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  send_user_message(you_id: number, user_id: number, data: PlainObject) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/send-message/${user_id}`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_user_last_opened(you_id: number) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/notifications/update-last-opened`, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  
  /** PUT */
  
  create_stripe_account<T = any>(you_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<T>>(
      `/users/${you_id}/create-stripe-account`, `PUT`
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  verify_stripe_account<T = any>(you_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<T>>(
      `/users/${you_id}/verify-stripe-account`, `PUT`
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  sign_in(data: PlainObject) {
    return this.clientService.sendRequest<any>('/users', `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  update_info(id: number, data: PlainObject) {
    const endpoint = `/users/${id}/info`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_password(id: number, data: PlainObject) {
    const endpoint = `/users/${id}/password`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_phone(id: number, data: PlainObject) {
    const endpoint = `/users/${id}/phone`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_icon(id: number, formData: FormData) {
    const endpoint = `/users/${id}/icon`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_wallpaper(id: number, formData: FormData) {
    const endpoint = `/users/${id}/wallpaper`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_user_field(you_id: number, id: number, data: PlainObject) {
    const endpoint = `/users/${you_id}/user-field/${id}`;
    return this.clientService.sendRequest<IUserField>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_latest_coordinates(you_id: number, data: { lat: number, lng: number, automated: boolean }) {
    const endpoint = `/users/${you_id}/latest-coordiates`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem(JWT_NAME, response.data.token);
        this.userStore.mergeState(response.data.you, false);
        return response;
      })
    );
  }

  /** DELETE */

  delete_user_field(you_id: number, id: number) {
    const endpoint = `/users/${you_id}/user-field/${id}`;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  unfollow_user(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
