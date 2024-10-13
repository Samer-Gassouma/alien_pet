'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import Loading from '@/components/loading'

interface AlienPet {
  _id: string
  name: string
  species: string
  planet: string
  description: string
  imageUrl: string
}

export default function PetDetailsPage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState<AlienPet | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchPetDetails() {
      try {
        const response = await fetch(`/api/alien-pets/${params.id}`)
        if (response.ok) {
          const petData = await response.json()
          setPet(petData)
        } else {
          console.error('Failed to fetch pet details')
        }
      } catch (error) {
        console.error('Error fetching pet details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPetDetails()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loading />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">Pet not found</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 max-w-2xl">
        <Button onClick={() => router.back()} variant="outline" className="mb-6 text-red-500">
          <ArrowLeft className="mr-2 h-4 w-4 text-red-500" /> Back to List
        </Button>
        <Card className="bg-gray-800 border-gray-700 overflow-hidden shadow-lg">
          <div className="relative w-full h-64">
            <Image 
              src={pet.imageUrl} 
              alt={pet.name} 
              layout="fill" 
              objectFit="cover" 
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-400">{pet.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-purple-300 bg-purple-900/50">
                {pet.species}
              </Badge>
              <Badge variant="secondary" className="text-blue-300 bg-blue-900/50">
                {pet.planet}
              </Badge>
            </div>
            <p className="text-gray-300 leading-relaxed">{pet.description}</p>
          </CardContent>
         
        </Card>
      </div>
    </div>
  )
}
