"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterFormData, RegisterFormResponse } from "@/types/register";
import { httpClient } from "@/lib/http-client";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fname: "",
    lname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;

      const response = await httpClient.post<
        RegisterFormResponse,
        Omit<RegisterFormData, "confirmPassword">
      >(API_ENDPOINTS.REGISTER, registerData);

      toast.success(response.message || "Account created successfully!");

      setFormData({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // Handle API errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error("Please fix the errors below");
      } else {
        const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        toast.error(errorMessage);
        setErrors({ email: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fname">First Name</Label>
              <Input
                id="fname"
                name="fname"
                type="text"
                value={formData.fname}
                onChange={handleInputChange}
                aria-invalid={!!errors.fname}
                disabled={isLoading}
              />
              {errors.fname && (
                <p className="text-sm text-destructive">{errors.fname}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lname">Last Name</Label>
              <Input
                id="lname"
                name="lname"
                type="text"
                value={formData.lname}
                onChange={handleInputChange}
                aria-invalid={!!errors.lname}
                disabled={isLoading}
              />
              {errors.lname && (
                <p className="text-sm text-destructive">{errors.lname}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              aria-invalid={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              aria-invalid={!!errors.username}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              aria-invalid={!!errors.password}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              aria-invalid={!!errors.confirmPassword}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
           <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/" className="underline underline-offset-4">
                Log In
              </a>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
