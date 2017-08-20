import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { NodeEntity, CreatedNode, FileAttach } from '../models/node';
import { FileEntity } from '../models/file';
import { CommentEntity } from '../models/comment';

/**
 * node service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class NodeService extends MainService {
  entityType = 'node';

  getAllNodes(): Observable<NodeEntity[]> {
    return this.get();
  }

  getNodeById(nid: number): Observable<NodeEntity> {
    return this.get('', nid);
  }

  createNode(node: NodeEntity): Observable<CreatedNode> {
    return this.post('', node);
  }

  updateNode(node: NodeEntity): Observable<CreatedNode> {
    return this.put('', node.nid, node);
  }

  deleteNode(nid: number): Observable<boolean[]> {
    return this.delete('', nid);
  }

  files(nid: number): Observable<FileEntity[]> {
    return this.get(`${nid}/files`);
  }

  comments(nid: number): Observable<CommentEntity[]> {
    return this.get(`${nid}/comments`);
  }

  attachFilesToNode(nid: number, file: FileAttach): Observable<CommentEntity[]> {
    return this.post(`${nid}/attach_file`, file);
  }

}
