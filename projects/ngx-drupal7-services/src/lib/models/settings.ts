interface Storage {
  getItem(key:string),
  setItem(ket:string,value:string),
  clear()
}

export interface Settings {
  apiProtocol: 'http' | 'https';
  apiHost: string;
  apiPort?: number;
  apiEndPoint: string;
  language: string;
  requestTimeout: number;
  cookieHeader?: boolean;
  allowOffline?: boolean;
  sessionDays?: number;
  localStorage?: Storage
}
