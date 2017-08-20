import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { CommentEntity, CreatedComment } from '../models/comment';

/**
 * comment service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class CommentService extends MainService {
  entityType = 'comment';

  getAllComments(): Observable<CommentEntity[]> {
    return this.get();
  }

  getCommentById(cid: number): Observable<CommentEntity> {
    return this.get('', cid);
  }

  createComment(comment: CommentEntity): Observable<CreatedComment> {
    return this.post('', comment);
  }

  updateComment(comment: CommentEntity): Observable<number[]> {
    return this.put('', comment.cid, comment);
  }

  deleteComment(cid: number): Observable<boolean[]> {
    return this.delete('', cid);
  }

  countAllCommentsByNodeId(nid: number): Observable<number> {
    return this.post('countAll', {nid: nid});
  }

  countNewCommentsByNodeId(nid: number): Observable<number> {
    return this.post('countNew', {nid: nid});
  }

}
