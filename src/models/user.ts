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
  pass?: string,
}

export interface LoginCredentials {
  username: string,
  password: string,
}

export interface CreatedUser {
  uid: number,
  uri: string,
}

export interface PasswordReset {
  uid: number,
  timestamp:  number,
  hashed_pass: string,
}

export interface PasswordResetResponse {
  message: string,
  pass_reset_token: string,
}
