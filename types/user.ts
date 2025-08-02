export interface UserUpdateFormData {
  fname: string;
  lname: string;
  username: string;
  profile?: File | null;
}