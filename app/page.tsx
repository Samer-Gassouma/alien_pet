'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/LoginButton'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    if (session.user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
            Welcome to Galactic Pet Adoption Center
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Please login to view our amazing alien pets
          </p>
          <div className="p-4 bg-gray-800 rounded-lg shadow-xl">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  )
}
