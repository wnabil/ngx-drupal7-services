import { Settings } from '../models/settings';
import { SystemConnection } from '../models/system';

export class DrupalConstants {
  private static instance: DrupalConstants;

  private settings: Settings;
  private connection: SystemConnection;

  constructor() { }

  static get Instance() {
    if (!this.instance) {
      this.instance = new DrupalConstants();
    }
    return this.instance;
  }

  static get Settings(): Settings {
    if (!this.Instance.settings) {
      throw "Application settings are not set, Please read README.MD file";
    }
    return this.Instance.settings;
  }

  static set Settings (newSettings: Settings) {
    this.Instance.settings = newSettings;
  }

  static get backEndUrl(): string {
    const settings = this.Settings;
    const url = settings.apiProtocol + '://' + settings.apiHost;
    return settings.apiPort ? url + ':' + settings.apiPort + '/' : url + '/';
  }

  static get restUrl(): string {
    const settings = this.Settings;
    return this.backEndUrl + settings.apiEndPoint + '/';
  }

  static set Connection (newConnection: SystemConnection) {
    this.Instance.connection = newConnection;
  }

  static get Connection (): SystemConnection {
    return this.Instance.connection;
  }
}
