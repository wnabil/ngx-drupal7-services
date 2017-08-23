import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { TaxonomyTerm } from '../models/taxonomy-term';
import { NodeEntity } from '../models/node';

/**
 * taxonomy term service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class TaxonomyTermService extends MainService {
  entityType = 'taxonomy_term';

  getAllTaxonomyTerms(): Observable<TaxonomyTerm[]> {
    return this.get();
  }

  getTaxonomyTermById(tid: number): Observable<TaxonomyTerm> {
    return this.get(tid);
  }

  createTaxonomyTerm(taxonomyTerm: TaxonomyTerm): Observable<number[]> {
    return this.post(taxonomyTerm);
  }

  updateTaxonomyTerm(taxonomyTerm: TaxonomyTerm): Observable<number[]> {
    return this.put(taxonomyTerm, taxonomyTerm.tid);
  }

  deleteTaxonomyTerm(tid: number): Observable<number[]> {
    return this.delete(tid);
  }

  getAllNodesForTerm(tid: number): Observable <NodeEntity[]> {
    return this.post({tid: tid}, 'selectNodes');
  }
}
