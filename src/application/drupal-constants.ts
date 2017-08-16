import { Settings } from './settings';

export class DrupalConstants {
  private static instance: DrupalConstants;
  private settings: Settings;

  constructor() {
    this.settings = new Settings();
  }

  static get Instance() {
    if (!this.instance) {
      this.instance = new DrupalConstants();
    }
    return this.instance;
  }

  static get Settings() {
    return this.Instance.settings;
  }
}
