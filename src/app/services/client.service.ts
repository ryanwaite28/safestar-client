import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppEnvironment, ServiceMethodResultsInfo } from '../interfaces/_common.interface';
import { JWT_NAME } from '../_misc/vault';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  DOMAIN: string;
  API_PREFIX: string;
  isProd: boolean;
  xsrf_token: string = '';

  private xsrf_token_ready = new BehaviorSubject<string | null>(null);

  constructor(
    @Inject('environment') private environment: AppEnvironment,
    public http: HttpClient,
  ) {
    this.isProd = environment.production;
    this.DOMAIN = environment.apiDomain;
    const apiDomain = this.DOMAIN;
    this.API_PREFIX = apiDomain;
  }

  isXsrfTokenReady() {
    return this.xsrf_token_ready.asObservable();
  }

  getXsrfToken() {
    return this.sendRequest<any>(`/utils/get-xsrf-token-pair`, 'GET')
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  sendRequest<T = any>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object | FormData | null,
    customHeaders?: HttpHeaders,
    report_progress: boolean = false,
  ): Observable<ServiceMethodResultsInfo<T>> {
    const api_url = this.API_PREFIX + route;
    const jwt = window.localStorage.getItem(JWT_NAME) || '';
    const httpOptions = {
      withCredentials: true,
      reportProgress: report_progress,
      headers: customHeaders || new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }),
    };
    if (data && data.constructor === Object) {
      httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    }
    if (this.xsrf_token) {
      httpOptions.headers = httpOptions.headers.set('x-xsrf-token', this.xsrf_token);
    }

    let requestObservable: Observable<ServiceMethodResultsInfo<T>>;

    switch (method) {
      case 'GET': {
        requestObservable = (<any> this.http.get(api_url, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'POST': {
        requestObservable = (<any> this.http.post(api_url, data, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'PUT': {
        requestObservable = (<any> this.http.put(api_url, data, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'DELETE': {
        requestObservable = (<any> this.http.delete(api_url, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
    }

    return requestObservable;
  }
}