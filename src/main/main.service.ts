import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Rx';
import { DrupalConstants } from '../application/drupal-constants';

/**
 * the main service is the basic http service of all other services "parent" that implements all the required request.
 * this service will add the headers automatically for each request it self
 */
@Injectable()
export class MainService {
  /**
   * entity type of the current service, the main service dont have any thing but the other services must use it
   * for example "node, comment, user, system"
   */
  protected readonly entityType: string;

  /**
   * the main constractor of this service will inject the required services dynamically.
   * @param http basic http service
   * @param cookieService ngx-cookie service provider to save the cookies
   * @see https://angular.io/guide/dependency-injection
   * @see https://www.npmjs.com/package/ngx-cookie
   */
  constructor(private http: Http, public cookieService: CookieService) { }

  /**
   * a getter to return the required headers for drupal
   * X-CSRF-Token - application token from services/session/connect
   * Content-Type - the type of the request content.
   * Accept - forcing drupal to return the response as a json object
   * @return object of the headers
   */
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

  /**
   * building up the full url path for each resource and / or params
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param selector the selector for some requests like getting a node by number ex: node/'1'
   * @return full request path after adding the entity type and resource param
   */
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

  /**
   * adding http request configs: request timeout, error handler, json convert
   * @param httpObservableRequest the http Observable to request
   * @param toJson to convert the response to json object
   * @return Observable of the request after adding required configs
   */
  private httpRequestWithConfig(httpObservableRequest: Observable<any>, toJson: boolean = true): Observable<any> {
    if (toJson) {
      return this.httpRequestWithConfig(httpObservableRequest, false).map(res => res.json());
    }
    return httpObservableRequest.timeout(DrupalConstants.Settings.requestTimeout).catch(err => Observable.throw(err));
  }

  /**
   * basic http get request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param selector the selector for some requests like getting a node by number ex: node/'1'
   * @return http json response
   */
  get(resource: string = '', selector?: number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.get(this.fullRequestURL(resource, selector), this.options)
    );
  }

  /**
   * basic http post request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  post(resource: string = '', body: any = {}): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.post(this.fullRequestURL(resource), body, this.options),
    );
  }

  /**
   * basic http put request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param selector the selector for some requests like getting a node by number ex: node/'1'
   * @param body the contenct of the request
   * @return http json response
   */
  put(resource: string = '', selector: number, body: any): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.put(this.fullRequestURL(resource, selector), body, this.options),
    );
  }

  /**
   * basic http delete request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param selector the selector to delete
   * @return http json response
   */
  delete(resource: string = '', selector: number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.delete(this.fullRequestURL(resource, selector), this.options),
    );
  }

  /**
   * getting token from drupal services module
   * @return http text token response
   */
  protected getToken(): Observable<string> {
    return this.httpRequestWithConfig(
      this.http.get(`${DrupalConstants.Settings.backEndUrl}services/session/token`, this.options), false
    ).map(res => res.text());
  }

  protected removeSession(): void {
    this.cookieService.remove("token");
    this.cookieService.remove("sessid");
    this.cookieService.remove("session_name");
    this.cookieService.remove("timestamp");
  }

  public saveSession(sessid: string, session_name: string, timestamp: number, token?: string): void {
    if (token) {
      this.cookieService.put("token", token);
    }
    this.cookieService.put("sessid", sessid);
    this.cookieService.put("session_name", session_name);
    this.cookieService.put("timestamp", timestamp.toString());
  }

  protected isConnected(): boolean {
    return this.cookieService.get("token") &&
    this.cookieService.get("sessid") &&
    this.cookieService.get("session_name") &&
    !this.isConnectionExpired() ?
    true : false;
  }

  protected isConnectionExpired(): boolean {
    const nowTS = Math.floor(Date.now());
    const expirationTS = 1987200000;
    return nowTS - +this.cookieService.get("timestamp") < expirationTS
  }
}
