import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Rx';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection } from '../models/system';

/**
 * the main service is the basic http service of all other services "parent" that implements all the required request.
 * this service will add the headers automatically for each request it self
 */
@Injectable()
export class MainService {
  /**
   * entity type of the current service, the main service dont have anything but the other services must use it
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
  constructor(protected http: Http, private cookieService: CookieService) { }

  /**
   * structure a full entity for drupal request
   * @param entity the entity to be structured
   * @param ignoredFields fields to be ignored just like nid or uid or title
   * @param language language of the entity
   */
  structureEntity(entity: any, ignoredFields: string[], language?: string): any {
    Object.keys(entity).forEach((key: string, index: number) => {
      if (ignoredFields.indexOf(key) === -1) {
        entity[key] = this.structureField(entity[key], key, language);
      }
    });
    return entity;
  }

  /**
   * structure the field for drupal services request
   * @param value the field value
   * @param label field name
   * @param language language of the field
   */
  structureField(value: any, label: string = "value", language?: string) {
    if (!language) {
      language = DrupalConstants.Settings.language;
    }
    const item = {};
    if (this.isArray(value)) {
      const field_array = [];
      for (var i = 0, l = value.length; i < l; i++) {
        item[label] = value[i];
        field_array.push(item);
      }
      return {
        [language]: field_array
      };
    }
    if (value instanceof Date) {
      const obj = {
        value: {
          date: `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`
        }
      };
      return {
        [language]: [
          obj
        ]
      };
    }
    // field value given with label(s) already built
    if (typeof value == "object") {
      return {
        [language]: [
          value
        ]
      }
    }
    item[label] = value;
    return {
      [language]: [
        item
      ]
    };
  }

  /**
   * a getter to return the required headers for drupal
   * X-CSRF-Token - application token from services/session/connect
   * Content-Type - the type of the request content.
   * Accept - forcing drupal to return the response as a json object
   * @return object of the headers
   */
  get options(): RequestOptionsArgs {
    const headers = new Headers();
    headers.set('X-CSRF-Token', this.getSavedVariable('token'));
    if (DrupalConstants.Settings.cookieHeader) {
      headers.set('Cookie', `${this.getSavedVariable('session_name')}=${this.getSavedVariable('sessid')}`);
    }
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    const options: RequestOptionsArgs = new RequestOptions();
    options.headers = headers;
    options.withCredentials = true;
    return options;
  }

  /**
   * getting token from drupal services module
   * @return http text token response
   */
  protected getToken(): Observable<string> {
    return this.httpRequestWithConfig(
      this.http.get(`${DrupalConstants.backEndUrl}services/session/token`, this.options), false
    ).map(res => {
      this.cookieService.put("token", res.text());
      return res.text()
    });
  }

  /**
   * Saving drupal session and token in cookies using ngx-cookie service
   * @param connection drupal connection
   */
  protected saveSessionToken(connection: SystemConnection): void {
    if (!connection.token) {
      connection.token = this.getSavedVariable('token');
    }
    this.removeSession();
    DrupalConstants.Connection = connection;
    this.cookieService.put(connection.session_name, connection.sessid, {httpOnly: true});
    this.cookieService.put("sessid", connection.sessid);
    this.cookieService.put("session_name", connection.session_name);
    this.cookieService.put("timestamp", connection.user.timestamp.toString());
    this.cookieService.put("token", connection.token);
  }

  /**
   * building up the full url path for each resource and / or params
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return full request path after adding the entity type and resource param
   */
  protected fullRequestURL(resource?: string | number): string {
    var request_url = DrupalConstants.restUrl;

    if (this.entityType) {
      request_url += this.entityType + '/';
    }

    if (resource) {
      request_url += resource;
    }

    return request_url;
  }

  /**
   * adding http request configs: request timeout, error handler, json convert
   * its a recursion method that will recall itself if the json convert is true
   * @param httpObservableRequest the http Observable to request
   * @param toJson to convert the response to json object
   * @return Observable of the request after adding required configs
   */
  protected httpRequestWithConfig(httpObservableRequest: Observable<any>, toJson: boolean = true): Observable<any> {
    if (toJson) {
      return this.httpRequestWithConfig(httpObservableRequest, false).map(res => res.json());
    }
    return httpObservableRequest.timeout(DrupalConstants.Settings.requestTimeout).catch(err => DrupalConstants.Instance.handleOffline(err));
  }

  /**
   * basic http get request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  protected get(resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.get(this.fullRequestURL(resource), this.options)
    );
  }

  /**
   * basic http post request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  protected post(body: any = {}, resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.post(this.fullRequestURL(resource), body, this.options),
    );
  }

  /**
   * basic http put request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @param body the contenct of the request
   * @return http json response
   */
  protected put(body: any = {}, resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.put(this.fullRequestURL(resource), body, this.options),
    );
  }

  /**
   * basic http delete request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  protected delete(resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.http.delete(this.fullRequestURL(resource), this.options),
    );
  }

  /**
   * Clearing drupal session after logging out
   */
  protected removeSession(): void {
    this.cookieService.removeAll();
  }

  /**
   * Checking the current connection if the connection is init and valid
   * @return if connection is valid
   */
  protected isConnected(): boolean {
    return this.getSavedVariable('token') &&
      this.getSavedVariable('sessid') &&
      this.getSavedVariable('session_name') &&
      !this.isConnectionExpired() ?
      true : false;
  }

  /**
   * Check if the drupal session is timedout.
   * @return true if the current date is less than the login date by 24 day "drupal default session timeout is 24 day".
   */
  protected isConnectionExpired(): boolean {
    const nowTS: number = Math.floor(Date.now());
    var sessionDays: number = 23;
    if (DrupalConstants.Settings.sessionDays) {
      sessionDays = DrupalConstants.Settings.sessionDays;
    }
    const dayMS: number = 86400000; // 1 day to ms
    const expirationTS: number = sessionDays * dayMS;
    return nowTS - +this.getSavedVariable('timestamp') < expirationTS;
  }

  /**
   * Serializin arguments as a string
   * @param options object of drupal parametars to serialize
   * @return string of parameters
   */
  protected getArgs(options: any): string {
    if (!options) {
      return '';
    }
    var args = '?';
    Object.keys(options).forEach((key, index) => {
      args += this.optionToString(key, options[key]);
    });
    return args;
  }

  /**
   * Check if variable is array of objects
   * @param value array to check
   */
  private isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  /**
   * retrive the variable from the connection object or if there is no connection yet it will return them from the cookies
   * this will will allow you to implement your custom connection storage, just like ionic.
   * because the cookies is not always available on webview apps, you may need to save the connection in sqllite
   * and restore them directly.
   * @param variableName the name of the saved variable
   */
  private getSavedVariable(variableName: string): string {

    if (DrupalConstants.Connection) {
      if (DrupalConstants.Connection[variableName]) {
        return DrupalConstants.Connection[variableName];
      } else if (DrupalConstants.Connection.user && DrupalConstants.Connection.user[variableName]) {
        return DrupalConstants.Connection.user[variableName];
      }
    }

    return this.cookieService.get(variableName);
  }

  /**
   * serializing eatch option
   * @param key option key
   * @param value option value
   * @return single option serilization
   */
  protected optionToString(key: string, value: any): string {
    if (!value) {
      return '';
    }
    var str = '';
    if (value instanceof Array) {
      value.forEach((element, index) => {
        str += `${key}[${index}]=${element}&`;
      });
    } else if (value instanceof Object) {
      Object.keys(value).forEach((element, index) => {
        if (value instanceof Object) {
          str += this.serializeObject(value[element], `${key}[${element}]`);
        } else {
          str += `${key}[${element}]=${value[element]}&`;
        }
      });
    } else {
      str += `${key}=${value}&`;
    }
    return str;
  }

  /**
   * serializing the object keys
   * @param obj object to serialize
   */
  private serializeObject(obj: any, parentSerialized: string): string {
    var str = '';
    Object.keys(obj).forEach((key, index) => {
      const value = obj[key];
      if (value instanceof Object) {
        str += `${this.serializeObject(value, `${parentSerialized}[${key}]`)}`;
      } else {
        str += `${parentSerialized}[${key}]=${value}&`;
      }
    });
    return str;
  }

}
