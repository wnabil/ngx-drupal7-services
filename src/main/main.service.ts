import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Rx';
import { DrupalConstants } from '../application/drupal-constants';

@Injectable()
export class MainService {
  private timeout: number = 20000;

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

  private getURL(entityType: string, selector?: string | number, without_end_point?: boolean): string {
    var request_url = DrupalConstants.Settings.restUrl;

    if (without_end_point) {
      request_url = DrupalConstants.Settings.backEndUrl;
    }

    if (entityType) {
      request_url += entityType + '/';
    }

    if (selector) {
      request_url = request_url + selector;
    }

    return request_url;
  }

  private httpRequestWithConfig(HttpObservableRequest: Observable<any>, toJson: boolean = true): Observable<any> {
    if (toJson) {
      return this.httpRequestWithConfig(HttpObservableRequest, false).map(res => res.json());
    }
    return HttpObservableRequest.timeout(this.timeout).catch(err => Observable.throw(err));
  }

  get(entityType: string, selector?: string | number, toJson: boolean = true): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.get(this.getURL(entityType, selector, toJson), this.options), toJson
    );
  }

  post(entityType: string, body?: any): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.post(this.getURL(entityType), body ? body : {}, this.options),
    );
  }

  put(entityType: string, selector: number | string, body: any): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.put(this.getURL(entityType, selector), body, this.options),
    );
  }

  delete(entityType: string, selector: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.delete(this.getURL(entityType, selector), this.options),
    );
  }
}
