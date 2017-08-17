import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Rx';
import { DrupalConstants } from '../application/drupal-constants';

@Injectable()
export class MainService {
  protected entityType: string;

  constructor(private http: Http, public cookieService: CookieService) { }

  get options(): RequestOptionsArgs {
    const headers = new Headers();
    headers.set('X-CSRF-Token', this.cookieService.get('token'));
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    const options: RequestOptionsArgs = new RequestOptions();
    options.headers = headers;
    options.withCredentials = true;
    return options;
  }

  private fullRequestURL(resource: string, selector?: string | number): string {
    var request_url = DrupalConstants.Settings.restUrl;

    if (this.entityType) {
      request_url += this.entityType + '/';
    }

    if (resource) {
      request_url += resource + '/  ';
    }

    if (selector) {
      request_url += selector;
    }

    return request_url;
  }

  private httpRequestWithConfig(httpObservableRequest: Observable<any>, toJson: boolean = true): Observable<any> {
    if (toJson) {
      return this.httpRequestWithConfig(httpObservableRequest, false).map(res => res.json());
    }
    return httpObservableRequest.timeout(DrupalConstants.Settings.requestTimeout).catch(err => Observable.throw(err));
  }

  get(resource: string, selector?: string | number): Observable<Response> {
    return this.httpRequestWithConfig(
      this.http.get(this.fullRequestURL(resource, selector), this.options)
    );
  }

  post(resource: string, body: any = {}): Observable<Response> {
    return this.httpRequestWithConfig(
      this.http.post(this.fullRequestURL(resource), this.options),
    );
  }

  put(resource: string, selector: number | string, body: any): Observable<Response> {
    return this.httpRequestWithConfig(
      this.http.put(this.fullRequestURL(resource, selector), body, this.options),
    );
  }

  delete(resource: string, selector: string | number): Observable<Response> {
    return this.httpRequestWithConfig(
      this.http.delete(this.fullRequestURL(resource, selector), this.options),
    );
  }

  protected getToken(): Observable<string> {
    return this.httpRequestWithConfig(
      this.http.get(`${DrupalConstants.Settings.backEndUrl}services/session/token`, this.options), false
    ).map(res => res.text());
  }
}
