export interface AccountRequest {
  email: string;
  username: string;
  role: string;
}

export interface AccountResponse {
  avatar: string | null;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
}
