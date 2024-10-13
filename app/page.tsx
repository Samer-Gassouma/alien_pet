'use client'

import { useState, useEffect } from 'react'
import AlienPetList from '../components/AlienPetList'

interface AlienPet {
  _id: string
  name: string
  species: string
  planet: string
  description: string
  imageUrl: string
}

export default function Home() {
  const [alienPets, setAlienPets] = useState<AlienPet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlienPets()
  }, [])

  const fetchAlienPets = async () => {
    const response = await fetch('/api/alien-pets')
    if (response.ok) {
      const pets = await response.json()
      setAlienPets(pets)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-5xl font-bold text-center mb-12 pt-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          Galactic Pet Adoption Center
        </h1>
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-red-500">Alien Pets</h2>
          <AlienPetList initialPets={alienPets} loading={loading} />
        </div>
      </div>
    </div>
  )
}
