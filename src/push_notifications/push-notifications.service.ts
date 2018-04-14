import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { PushNotifications, PushResponse } from '../models/push-notifications';

/**
 * view service for drupal using push_notifications module
 * @see https://www.drupal.org/project/push_notifications
 */
@Injectable()
export class PushNotificationsSerivce extends MainService {
  entityType = 'push_notifications';

  /**
   * create/register new device with a token
   * @param pushNotifications notification object to register
   */
  create(pushNotifications: PushNotifications): Observable<PushResponse> {
    return this.post(pushNotifications);
  }

  /**
   * delete a subscription by device token
   * @param token token of the device to be deleted
   */
  delete_push(token: string): Observable<PushResponse> {
    return this.delete(token);
  }

}
