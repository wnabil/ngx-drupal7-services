export interface User {
  mail: string,
  name: string,
  access?: number,
  created?: number,
  data?: boolean,
  init?: string,
  language?: string,
  login?: number,
  picture?: number,
  roles?: {[rid: number]: string},
  signature?: string,
  signature_format?: string,
  status?: number,
  theme?: number,
  timezone?: string,
  uid?: number,
  timestamp?: number,
  password?: string,
}

export interface LoginCredentials {
  username: string,
  password: string,
}
