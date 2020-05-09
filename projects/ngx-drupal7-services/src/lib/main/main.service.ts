
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, timeout, map } from 'rxjs/operators';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection } from '../models/system';
import { isPlatformServer } from '@angular/common';

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
  constructor(protected httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  /**
   * structure a full entity for drupal request
   * @param entity the entity to be structured
   * @param ignoredFields fields to be ignored just like nid or uid or title
   * @param fieldLabels: the label for each field just like "{field_custom_field: 'value'}"
   * @param language language of the entity
   */
  structureEntity(entity: any, ignoredFields: string[], fieldLabels?: any[], language?: string): any {
    Object.keys(entity).forEach((key: string, index: number) => {
      if (ignoredFields.indexOf(key) === -1) {
        let fieldLabel;
        if (fieldLabels[key]) {
          fieldLabel = fieldLabels[key];
        }
        entity[key] = this.structureField(entity[key], fieldLabel, language);
      }
    });
    return entity;
  }

  /**
   * structure the field for drupal services request
   * @param value the field value
   * @param label field label name
   * @param language language of the field
   */
  structureField(value: any, label: string = 'value', language?: string) {
    if (!language) {
      language = DrupalConstants.Settings.language;
    }
    const item = {};
    if (this.isArray(value)) {
      const field_array = [];
      for (let i = 0, l = value.length; i < l; i++) {
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
          date: `${value.getFullYear()}-${value.getMonth() + 1}-` +
            `${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`
        }
      };
      return {
        [language]: [
          obj
        ]
      };
    }
    // field value given with label(s) already built
    if (typeof value === 'object') {
      return {
        [language]: [
          value
        ]
      };
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
  get options(): any {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const token = this.getSavedVariable('token');
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    headers['Authentication'] = `${this.getSavedVariable('session_name')}=${this.getSavedVariable('sessid')}`;
    if (DrupalConstants.Settings.cookieHeader) {
      headers['Cookie'] = `${this.getSavedVariable('session_name')}=${this.getSavedVariable('sessid')}`;
    }
    const options = {
      headers: headers,
      withCredentials: true,
      reportProgress: true,
    };
    return options;
  }

  /**
   * getting token from drupal services module
   * @return http text token response
   */
  protected getToken(): Observable<string> {
    const options = this.options;
    options['responseType'] = 'text';
    return this.httpRequestWithConfig(
      this.httpClient.get(`${DrupalConstants.backEndUrl}services/session/token`, options)
    ).pipe(map(res => {
      if (!isPlatformServer(this.platformId)) {
        localStorage.setItem('token', res);
      }
      return res;
    }));
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
    if (!isPlatformServer(this.platformId)) {
      localStorage.setItem(connection.session_name, connection.sessid);
      localStorage.setItem('sessid', connection.sessid);
      localStorage.setItem('session_name', connection.session_name);
      localStorage.setItem('token', connection.token);
      if (connection.user && connection.user.timestamp) {
        localStorage.setItem('timestamp', connection.user.timestamp.toString());
      } else {
        localStorage.setItem('timestamp', Math.floor(Date.now()).toString());
      }
    }
  }

  /**
   * building up the full url path for each resource and / or params
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return full request path after adding the entity type and resource param
   */
  protected fullRequestURL(resource?: string | number): string {
    let request_url = DrupalConstants.restUrl;

    if (this.entityType) {
      request_url += this.entityType;
    }

    if (resource) {
      if (request_url[request_url.length - 1] === '/') {
        request_url += resource;
      } else {
        request_url += '/' + resource;
      }
    }

    return request_url;
  }

  /**
   * adding http request configs: request timeout, error handler
   * @param httpObservableRequest the http Observable to request
   * @return Observable of the request after adding required configs
   */
  protected httpRequestWithConfig(httpObservableRequest: Observable<any>): Observable<any> {
    return httpObservableRequest.pipe(
      timeout(DrupalConstants.Settings.requestTimeout),
      catchError(err => DrupalConstants.Instance.handleOffline(err))
    );
  }

  /**
   * basic http get request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  protected get(resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.httpClient.get(this.fullRequestURL(resource), this.options)
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
      this.httpClient.post(this.fullRequestURL(resource), body, this.options),
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
      this.httpClient.put(this.fullRequestURL(resource), body, this.options),
    );
  }

  /**
   * basic http delete request with headers.
   * @param resource the entity resource param. ex: system/'connect', user/'login'
   * @return http json response
   */
  protected delete(resource?: string | number): Observable<any> {
    return this.httpRequestWithConfig(
      this.httpClient.delete(this.fullRequestURL(resource), this.options),
    );
  }

  /**
   * Clearing drupal session after logging out
   */
  protected removeSession(): void {
    if (!isPlatformServer(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('timestamp');
      localStorage.removeItem('sessid');
      localStorage.removeItem('session_name');
      if (DrupalConstants.Connection && DrupalConstants.Connection.session_name) {
        localStorage.removeItem(DrupalConstants.Connection.session_name);
      }
    }
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
    let sessionDays = 23;
    if (DrupalConstants.Settings.sessionDays) {
      sessionDays = DrupalConstants.Settings.sessionDays;
    }
    const dayMS = 86400000; // 1 day to ms
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
    let args = '?';
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
    if (!isPlatformServer(this.platformId)) {
      return localStorage.getItem(variableName);
    }
    return;
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
    let str = '';
    if (value instanceof Array) {
      value.forEach((element, index) => {
        str += `${key}[${index}]=${element}&`;
      });
    } else if (value instanceof Object) {
      Object.keys(value).forEach((element: string, index) => {
        if (value[element] instanceof Object) {
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
    let str = '';
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
