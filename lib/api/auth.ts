import { httpClient } from "@/lib/http-client";
import { API_ENDPOINTS } from "./api-endpoints";
import { LoginFormData, LoginFormResponse } from "@/types/login";

type User = LoginFormResponse["user"];

export const authApi = {
  async login(credentials: LoginFormData): Promise<LoginFormResponse> {
    return httpClient.post<LoginFormResponse, LoginFormData>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
  },

  async logout(): Promise<void> {
    return httpClient.delete<void>(API_ENDPOINTS.LOGOUT);
  },

  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>(API_ENDPOINTS.ME);
  },
};
