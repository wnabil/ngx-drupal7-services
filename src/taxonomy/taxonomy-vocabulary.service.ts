import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { TaxonomyVocabulary, TaxonomyVocabularyTree } from '../models/taxonomy-vocabulary';

/**
 * taxonomy vocabulary service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class TaxonomyVocabularyService extends MainService {
  entityType = 'taxonomy_vocabulary';

  getAllVocabularies(): Observable<TaxonomyVocabulary[]> {
    return this.get();
  }

  getTaxonomyVocabularyById(vid: number): Observable<TaxonomyVocabulary> {
    return this.get(vid);
  }

  createTaxonomyVocabulary(taxonomyVocabulary: TaxonomyVocabulary): Observable<number[]> {
    return this.post(taxonomyVocabulary);
  }

  updateTaxonomyVocabulary(taxonomyVocabulary: TaxonomyVocabulary): Observable<number[]> {
    return this.put(taxonomyVocabulary, taxonomyVocabulary.vid);
  }

  deleteTaxonomyVocabulary(vid: number): Observable<number[]> {
    return this.delete(vid);
  }

  getTaxonomyVocabularyByMachineName(vocabularyMachineName: string): Observable<TaxonomyVocabulary> {
    return this.post({machine_name: vocabularyMachineName}, 'retrieveByMachineName');
  }

  getTaxonomyVocabularyTree(vid: number): Observable<TaxonomyVocabularyTree[]> {
    return this.post({vid: vid}, 'getTree');
  }

}
