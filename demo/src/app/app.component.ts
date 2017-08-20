import { Component } from '@angular/core';
import { MainService, DrupalConstants, UserService, SystemService, NodeService, FileAttach } from '../../../';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  result: any;

  constructor(
    private userService: UserService,
    private systemService: SystemService,
    private nodeService: NodeService,
  ) {
  }

  connect() {
    this.systemService.connect().subscribe(data => {
      this.result = data;
    });
  }

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
      name: "test",
      mail: "awdwad@awwad.com",
    };
    this.userService.createUser(user).subscribe(data => {
      console.log(data)
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
      username: "root",
      password: "root"
    }
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
    this.userService.requestNewPassword("root").subscribe(data => {
      console.log(data);
    });
  }

  userPasswordReset() {
    const user = {
      uid: 941,
      timestamp: 	1503219733,
      hashed_pass: 'QQHza2KXN5GgM1IQxeeqllD1PNdeOooF6BQcl4mNboc',
    }
    this.userService.userPasswordReset(user).subscribe(data => {
      console.log(data);
    });
  }

  register() {
    const user = {
      name: "awdaewdawd",
      mail: 'awdwad@awdwead.com',
      pass: 'mypass'
    }
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
    }
    this.nodeService.createNode(node).subscribe(data => {
      console.log(data);
    });
  }

  updateNode() {
    const node = {
      nid: 1,
      title: 'eeeeee',
      type: 'article'
    }
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
}

