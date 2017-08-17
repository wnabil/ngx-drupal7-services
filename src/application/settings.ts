import { SystemConnection } from '../models/system';
import { SystemService } from '../system/system.service';

export class Settings {
  apiProtocol: 'http' | 'https' = 'http';
  apiHost: string = 'localhost';
  apiPort: number;
  apiEndPoint: string = 'api';
  language: string = 'und';
  requestTimeout: number = 5000;

  connection: SystemConnection;
  constructor() { }

  get backEndUrl(): string {
    const url = this.apiProtocol + '://' + this.apiHost;
    return this.apiPort ? url + ':' + this.apiPort + '/' : url + '/';
  }

  get restUrl(): string {
    return this.backEndUrl + this.apiEndPoint + '/';
  }
}
