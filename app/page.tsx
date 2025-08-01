"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/lib/hooks/useAuth"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted && !loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router, hasMounted])

  if (!hasMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg">Initializing...</div>
        <Progress value={33} className="w-64" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg">Checking authentication...</div>
        <Progress value={66} className="w-64" />
      </div>
    )
  }


  if (user) {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
