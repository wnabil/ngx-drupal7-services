export interface UserConnect {
  cache: number,
  hostname: string,
  roles: string[],
  timestamp: number,
  uid: number,
}

export interface SystemConnection {
  sessid: string,
  session_name: string,
  token?: string,
  user: UserConnect,
}
