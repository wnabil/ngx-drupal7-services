import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { CustomEntityOptions } from '../models/custom-entity';

/**
 * custom entity service for drupal using services_entity module
 * @see https://www.drupal.org/project/services_entity
 */
@Injectable()
export class EntityService extends MainService {
  entityType = 'entity_';

  protected fullRequestURL(entityMachineName: string): string {
    var request_url = DrupalConstants.restUrl;
    request_url += this.entityType + entityMachineName;

    return request_url;
  }

  indexEntity(entityMachineName: string, options?: CustomEntityOptions): Observable<Object[]> {
    const args = this.getArgs(options);
    return this.get(entityMachineName + args);
  }

  retrieveEntity(entityMachineName: string, selector: number, options?: CustomEntityOptions): Observable<Object> {
    const args = this.getArgs(options);
    return this.get(`${entityMachineName}/${selector}${args}`);
  }

  deleteEntity(entityMachineName: string, selector: number): Observable<null> {
    return this.delete(`${entityMachineName}/${selector}`);
  }

  createEntity(entityMachineName: string, entity: Object): Observable<Object> {
    return this.post(entity, entityMachineName);
  }

  updateEntity(entityMachineName: string, entity: Object, selector: number): Observable<Object> {
    return this.put(entity, `${entityMachineName}/${selector}`);
  }

}
