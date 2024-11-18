'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AlienPetList from '@/components/AlienPetList'
import LoginButton from '@/components/LoginButton'

interface AlienPet {
  _id: string
  name: string
  species: string
  planet: string
  description: string
  imageUrl: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [alienPets, setAlienPets] = useState<AlienPet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else {
      fetchAlienPets()
    }
  }, [status, router])

  const fetchAlienPets = async () => {
    const response = await fetch('/api/alien-pets')
    if (response.ok) {
      const pets = await response.json()
      setAlienPets(pets)
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
            Galactic Pet Adoption Center
          </h1>
          <LoginButton />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-red-500">Alien Pets</h2>
          <AlienPetList initialPets={alienPets} loading={loading} />
        </div>
      </div>
    </div>
  )
} 