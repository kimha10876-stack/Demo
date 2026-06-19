export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

export interface RefreshToken {
  token: string;
}
