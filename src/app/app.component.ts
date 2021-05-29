import { Component } from '@angular/core';
import {
  UserService, SystemService, NodeService, FileService,
  CommentService, TaxonomyTermService, TaxonomyVocabularyService, ViewService, ViewOptions, EntityService,
  CustomEntityOptions, MenuService, FacebookOAuthService, PushNotificationsSerivce, PushNotifications
} from 'ngx-drupal7-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  result: any;
  entityOptions: CustomEntityOptions = {
    fields: 'title,type'
  };

  constructor(
    private userService: UserService,
    private systemService: SystemService,
    private nodeService: NodeService,
    private fileService: FileService,
    private commentService: CommentService,
    private taxonomyTermService: TaxonomyTermService,
    private taxonomyVocabularyService: TaxonomyVocabularyService,
    private viewService: ViewService,
    private entityService: EntityService,
    private menuService: MenuService,
    private facebookOAuthService: FacebookOAuthService,
    private pushNotificationsSerivce: PushNotificationsSerivce,
  ) {
  }

  connect() {
    this.systemService.connect().subscribe(data => {
      this.result = data;
    });
  }

  getVariable() {
    this.systemService.getVariable('testvar').subscribe(data => {
      console.log(data);
    });
  }

  setVariable() {
    this.systemService.setVariable('testvar', { test: 'myval' }).subscribe(data => {
      console.log(data);
    });
  }

  delVariable() {
    this.systemService.delVariable('testvar').subscribe(data => {
      console.log(data);
    });
  }

  ////////////////////////////////////

  getUser() {
    this.userService.getUserById(1).subscribe(data => {
      console.log(data);
      this.result = data;
    });
  }

  getAllUsers() {
    this.userService.getUsersList().subscribe(data => {
      console.log(data);
      this.result = data;
    });
  }

  createUser() {
    const user = {
      name: 'test',
      mail: 'awdwad@awwad.com',
      pass: 'awdawd'
    };
    this.userService.createUser(user).subscribe(data => {
      console.log(data);
    });
  }

  updateUser() {
    this.result.user.name = 'teest';
    this.userService.updateUser(this.result).subscribe(data => {
      console.log(data);
    });
  }

  deleteUser() {
    this.userService.deleteUser(3).subscribe(data => {
      console.log(data);
    });
  }

  login() {
    const user = {
      username: 'root',
      password: 'root'
    };
    this.userService.login(user).subscribe(data => {
      console.log(data);
    });
  }

  logout() {
    this.userService.logout().subscribe(data => {
      console.log(data);
    });
  }

  requestPassword() {
    this.userService.requestNewPassword('root').subscribe(data => {
      console.log(data);
    });
  }

  userPasswordReset() {
    const user = {
      uid: 941,
      timestamp: 1503219733,
      hashed_pass: 'QQHza2KXN5GgM1IQxeeqllD1PNdeOooF6BQcl4mNboc',
    };
    this.userService.userPasswordReset(user).subscribe(data => {
      console.log(data);
    });
  }

  register() {
    const user = {
      name: 'awdaewdawd',
      mail: 'awdwad@awdwead.com',
      pass: 'mypass'
    };
    this.userService.registerAccount(user).subscribe(data => {
      console.log(data);
    });
  }

  cancelUser() {
    this.userService.cancelUser(7).subscribe(data => {
      console.log(data);
    });
  }

  passwordReset() {
    this.userService.passwordReset(7).subscribe(data => {
      console.log(data);
    });
  }

  resendWelcomeEmail() {
    this.userService.resendWelcomeEmail(1).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////////////////////////////////////////


  getNodeById() {
    this.nodeService.getNodeById(1).subscribe(data => {
      console.log(data);
    });
  }

  createNode() {
    const node = {
      title: 'adwadw',
      type: 'article'
    };
    this.nodeService.createNode(node).subscribe(data => {
      console.log(data);
    });
  }

  updateNode() {
    const node = {
      nid: 1,
      title: 'eeeeee',
      type: 'article'
    };
    this.nodeService.updateNode(node).subscribe(data => {
      console.log(data);
    });
  }

  deleteNode() {
    this.nodeService.deleteNode(1).subscribe(data => {
      console.log(data);
    });
  }

  files() {
    this.nodeService.files(2).subscribe(data => {
      console.log(data);
    });
  }

  comments() {
    this.nodeService.comments(2).subscribe(data => {
      console.log(data);
    });
  }

  attachFilesToNode() {
    const file = {
      field_name: 'field_image',
    };
    this.nodeService.attachFilesToNode(2, file).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////////////////////////////

  createFile() {
    const file = {
      file: 'CONTENT_HERE',
      filename: 'potato.png'
    };
    this.fileService.createFile(file).subscribe(data => {
      console.log(data);
    });
  }

  getAllFiles() {
    this.fileService.getAllFiles().subscribe(data => {
      console.log(data);
    });
  }

  getFileById() {
    this.fileService.getFileById(1).subscribe(data => {
      console.log(data);
    });
  }

  deleteFile() {
    this.fileService.deleteFile(1).subscribe(data => {
      console.log(data);
    });
  }

  createRaw() {
    this.fileService.createRaw().subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////////////////

  getAllComments() {
    this.commentService.getAllComments().subscribe(data => {
      console.log(data);
    });
  }

  getCommentById() {
    this.commentService.getCommentById(1).subscribe(data => {
      console.log(data);
    });
  }

  createComment() {
    // example of structuring the full entity
    let comment = {
      nid: 2,
      subject: 'awdwadwadda',
      comment_body: { value: 'adwdwaadw' },
    };
    const ignoreFields = ['nid', 'subject'];
    comment = this.commentService.structureEntity(comment, ignoreFields);
    this.commentService.createComment(comment).subscribe(data => {
      console.log(data);
    });
  }

  updateComment() {
    const comment = {
      cid: 4,
      nid: 2,
      subject: 'eeeeee',
      comment_body: this.commentService.structureField('adwdwwwwwwwaadw', 'value'), // example of field structure
    };
    this.commentService.updateComment(comment).subscribe(data => {
      console.log(data);
    });
  }

  deleteComment() {
    this.commentService.deleteComment(4).subscribe(data => {
      console.log(data);
    });
  }

  countAllByNodeId() {
    this.commentService.countAllCommentsByNodeId(2).subscribe(data => {
      console.log(data);
    });
  }

  countNewCommentsByNodeId() {
    this.commentService.countNewCommentsByNodeId(2).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////////////////

  getAllTaxonomyTerms() {
    this.taxonomyTermService.getAllTaxonomyTerms().subscribe(data => {
      console.log(data);
    });
  }

  getTaxonomyTermById() {
    this.taxonomyTermService.getTaxonomyTermById(1).subscribe(data => {
      console.log(data);
    });
  }

  createTaxonomyTerm() {
    const term = {
      name: 'test1',
      vid: 1,
    };
    this.taxonomyTermService.createTaxonomyTerm(term).subscribe(data => {
      console.log(data);
    });
  }

  updateTaxonomyTerm() {
    const term = {
      tid: 3,
      name: 'wdawdawadwdwadawd',
      vid: 1,
    };
    this.taxonomyTermService.updateTaxonomyTerm(term).subscribe(data => {
      console.log(data);
    });
  }

  deleteTaxonomyTerm() {
    this.taxonomyTermService.deleteTaxonomyTerm(3).subscribe(data => {
      console.log(data);
    });
  }

  getAllNodesForTerm() {
    this.taxonomyTermService.getAllNodesForTerm(1).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////

  getAllVocabularies() {
    this.taxonomyVocabularyService.getAllVocabularies().subscribe(data => {
      console.log(data);
    });
  }

  getTaxonomyVocabularyById() {
    this.taxonomyVocabularyService.getTaxonomyVocabularyById(1).subscribe(data => {
      console.log(data);
    });
  }

  createTaxonomyVocabulary() {
    const vocabulary = {
      name: 'voca'
    };
    this.taxonomyVocabularyService.createTaxonomyVocabulary(vocabulary).subscribe(data => {
      console.log(data);
    });
  }

  updateTaxonomyVocabulary() {
    const vocabulary = {
      name: 'test',
      vid: 6,
      machine_name: 'voeeeeca'
    };
    this.taxonomyVocabularyService.updateTaxonomyVocabulary(vocabulary).subscribe(data => {
      console.log(data);
    });
  }

  deleteTaxonomyVocabulary() {
    this.taxonomyVocabularyService.deleteTaxonomyVocabulary(6).subscribe(data => {
      console.log(data);
    });
  }

  getTaxonomyVocabularyByMachineName() {
    this.taxonomyVocabularyService.getTaxonomyVocabularyByMachineName('tags').subscribe(data => {
      console.log(data);
    });
  }

  getTaxonomyVocabularyTree() {
    this.taxonomyVocabularyService.getTaxonomyVocabularyTree(1).subscribe(data => {
      console.log(data);
    });
  }

  /////////////////////////////////////////////////

  getView() {
    const options: ViewOptions = {
      display_id: 'service_1',
      filters: {
        date: {
          value: {
            year: 2017,
            month: 2,
          }
        }
      }
    };
    this.viewService.getView('test', options).subscribe(data => {
      // console.log(data);
    });
  }

  ///////////////////////////////////////

  entityIndex() {
    this.entityService.indexEntity('potato').subscribe(data => {
      console.log(data);
    });
  }

  entityRetrive() {
    this.entityService.retrieveEntity('potato', 1, this.entityOptions).subscribe(data => {
      console.log(data);
    });
  }

  entityDelete() {
    this.entityService.deleteEntity('potato', 1).subscribe(data => {
      console.log(data);
    });
  }

  entityCreate() {
    const entity = {
      type: 'aaaa'
    };
    this.entityService.createEntity('potato', entity).subscribe(data => {
      console.log(data);
    });
  }

  entityUpdate() {
    const entity = {
      title: 'new title',
      type: 'aaaa',
      id: 4
    };
    this.entityService.updateEntity('potato', entity, 4).subscribe(data => {
      console.log(data);
    });
  }

  //////////////////////////////////

  menu() {
    this.menuService.getMenu('main-menu').subscribe(data => {
      console.log(data);
    });
  }

  ////////////////////////////////////

  fbOAuthConnect() {
    const accessToken = 'mytoken';
    this.facebookOAuthService.connect(accessToken).subscribe(data => {
      console.log(data);
    });
  }

  ////////////////////////////////////

  create_push() {
    const pushNotifications: PushNotifications = {
      type: 'android',
      token: 'testtoken'
    };
    this.pushNotificationsSerivce.create(pushNotifications).subscribe(data => {
      console.log(data);
    });
  }

  delete_push() {
    const token = 'testtoken';
    this.pushNotificationsSerivce.delete_push(token).subscribe(data => {
      console.log(data);
    });
  }

}

