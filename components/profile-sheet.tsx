"use client";

import * as React from "react";
import { Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";
import { userApi } from "@/lib/api/user";
import Image from "next/image";

interface ProfileSheetProps {
  children: React.ReactNode;
}

export function ProfileSheet({ children }: ProfileSheetProps) {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = React.useState({
    fname: "",
    lname: "",
    username: "",
  });
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (user) {
      setFormData({
        fname: user.fname || "",
        lname: user.lname || "",
        username: user.username || "",
      });

      if (user.profile) {
        setProfileImage(userApi.getProfileImageUrl(user.profile));
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    setSelectedFile(file);

    toast.success("Image selected!", {
      description: "Click 'Save Changes' to upload your new profile picture.",
    });
  };

  const handleSaveProfile = async () => {
    if (user) {
      const hasTextChanges =
        formData.fname !== (user.fname || "") ||
        formData.lname !== (user.lname || "") ||
        formData.username !== (user.username || "");

      const hasImageChange = selectedFile !== null;

      if (!hasTextChanges && !hasImageChange) {
        toast.info("No changes detected", {
          description: "Your profile information is already up to date.",
        });
        return;
      }
    }

    try {
      setIsSavingProfile(true);

      await refreshUser();

      setSelectedFile(null);

      toast.success("Profile updated!", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast.error("Failed to update profile", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>Update your personal information</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6 px-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Profile Picture</Label>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary overflow-hidden">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-primary-foreground" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <Label htmlFor="profile-upload" className="cursor-pointer">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSavingProfile}
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile ? "Change Photo" : "Upload Photo"}
                      </span>
                    </Button>
                  </Label>
                  {selectedFile && (
                    <div className="text-xs text-center text-muted-foreground">
                      {selectedFile.name} selected
                    </div>
                  )}
                  <Input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fname">First Name</Label>
              <Input
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lname">Last Name</Label>
              <Input
                id="lname"
                name="lname"
                value={formData.lname}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isSavingProfile && (
              <div className="flex flex-col gap-2">
                <Progress value={75} className="w-full" />
                <div className="text-xs text-center text-muted-foreground">
                  Saving changes...
                </div>
              </div>
            )}
            <Button
              onClick={handleSaveProfile}
              className="flex-1"
              disabled={isSavingProfile}
            >
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
