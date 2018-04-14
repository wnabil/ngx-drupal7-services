export interface PushNotifications {
  type: string,
  token: string,
  language?: string,
}

export interface PushResponse {
  success: number,
  message: string,
}
