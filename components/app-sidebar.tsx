"use client";
import * as React from "react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProfileSheet } from "@/components/profile-sheet";
import { userApi } from "@/lib/api/user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();

      toast.success("Logout successful!", {
        description: "You have been logged out successfully.",
      });

      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed", {
        description: "An error occurred while logging out.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ProfileSheet>
          <div className="flex items-center gap-3 px-2 py-3 cursor-pointer hover:bg-accent rounded-md transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary overflow-hidden">
              {user?.profile ? (
                <Image
                  src={userApi.getProfileImageUrl(user.profile)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              {loading ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                  <Progress value={50} className="w-full h-1" />
                </div>
              ) : user ? (
                <>
                  <div className="text-sm font-medium truncate">
                    {user.fname} {user.lname}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Not logged in
                </div>
              )}
            </div>
          </div>
        </ProfileSheet>
      </SidebarHeader>
      <SidebarContent>{/* Your navigation content goes here */}</SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="w-full">
                {isLoggingOut && (
                  <div className="flex flex-col gap-2 mb-2">
                    <Progress value={75} className="w-full" />
                    <div className="text-xs text-center text-muted-foreground">
                      Logging out...
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-8"
                  onClick={handleLogout}
                  disabled={loading || !user || isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </Button>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
