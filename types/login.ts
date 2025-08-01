export interface LoginFormResponse {
  message: string;
  user: {
    id: string;
    userType: string;
    fname: string;
    lname: string;
    username: string;
    email: string;
    profile: string | null;
  };
}
export interface LoginFormData {
  username: string;
  password: string;
}
