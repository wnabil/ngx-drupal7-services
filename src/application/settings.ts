export class Settings {
  apiProtocol: 'http'|'https' = 'http';
  apiHost: string = 'localhost';
  apiPort: number = 333;
  apiEndPoint: string = 'api';
  language: string = 'und';

  get backEndUrl(): string {
    const url = this.apiProtocol + '://' + this.apiHost;
    return this.apiPort ? url + ':' + this.apiPort + '/' : url + '/';
  }

  get restUrl(): string {
    return this.backEndUrl + this.apiEndPoint + '/';
  }
}
