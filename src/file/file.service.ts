import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { FileEntity, CreatedFile } from '../models/file';

/**
 * file service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class FileService extends MainService {
  entityType = 'file';

  getAllFiles(): Observable<FileEntity[]> {
    return this.get();
  }

  getFileById(fid: number): Observable<FileEntity> {
    return this.get('', fid);
  }

  createFile(file: FileEntity): Observable<CreatedFile> {
    return this.post('', file);
  }

  deleteFile(fid: number): Observable<boolean[]> {
    return this.delete('', fid);
  }

  createRaw(): Observable<boolean[]> {
    return this.post('create_raw');
  }

}
