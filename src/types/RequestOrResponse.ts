export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];   
  application: string;
  mfaEnabled: boolean;
  mfaBypassed: boolean;
}

export  interface ApiResponse<T> {
  message: string;
  data: T | null;
  status: number;
}

export interface RecaptchaRequest {
  token: string;
}