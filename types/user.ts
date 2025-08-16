export interface UserUpdateFormData {
  fname: string;
  lname: string;
  username: string;
  profile?: File | null;
}

export type UpdateProfileErrorResponse = {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]> | { field: string; message: string }[];
      error?: string;
    };
  };
};