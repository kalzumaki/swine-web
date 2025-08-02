import { UserUpdateFormData } from "@/types/user";

interface UpdateProfileResponse {
  message: string;
  user: {
    id: string;
    user_type: string;
    fname: string;
    lname: string;
    email: string;
    username: string;
    profile_image?: string;
  };
}

export const userApi = {
  async updateProfile(data: UserUpdateFormData): Promise<UpdateProfileResponse> {
    const formData = new FormData();
    
    formData.append('fname', data.fname);
    formData.append('lname', data.lname);
    formData.append('username', data.username);
    
    if (data.profile) {
      formData.append('profile', data.profile);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const normalizedBaseUrl = baseUrl?.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const url = new URL('profile', normalizedBaseUrl);

    const response = await fetch(url.toString(), {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  getProfileImageUrl(filename: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const normalizedBaseUrl = baseUrl?.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${normalizedBaseUrl}profile-image/${filename}`;
  },
};
