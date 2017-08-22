import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { ViewOptions } from '../models/view';

/**
 * view service for drupal using services_views module
 * @see https://www.drupal.org/project/services_views
 */
@Injectable()
export class ViewService extends MainService {
  entityType = 'views';

  private getViewArgs(options: ViewOptions): string {
    if (!options) {
      return '';
    }
    var args = '?';
    Object.keys(options).forEach((key, index) => {
      args += this.optionToString(key, options[key]);
    });
    return args;
  }

  private optionToString(key: string, value: any): string {
    var str = '';
    if (value instanceof Array) {
      value.forEach((element, index) => {
        str += `${key}[${index}]=${element}&`;
      });
    } else if (value instanceof Object) {
      Object.keys(value).forEach((element, index) => {
        str += `${key}[${element}]=${value[element]}&`;
      });
    } else {
      str += `${key}=${value}&`;
    }
    return str;
  }

  getView(viewMachineName: string, options?: ViewOptions): Observable<any[]> {
    const args = this.getViewArgs(options);
    return this.get(viewMachineName + args);
  }

}
