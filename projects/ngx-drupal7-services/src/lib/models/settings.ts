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
}
