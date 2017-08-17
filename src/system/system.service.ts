import { Injectable } from '@angular/core';
import { MainService } from '../main/main.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SystemService extends MainService {
  entityType = 'system';

  connect(): Observable<any> {
    if (this.cookieService.get("token")) {
      return this.post('connect');
    }

    return this.getToken().flatMap(token => {
      this.cookieService.put("token", token);
      return this.post("connect");
    });
  }
}
