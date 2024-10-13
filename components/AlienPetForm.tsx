'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

interface AlienPet {
  _id: string
  name: string
  species: string
  planet: string
  description: string
  imageUrl: string
}

interface AlienPetFormProps {
  onAddPet: (pet: AlienPet) => void
  isLoading: boolean
}

export default function AlienPetForm({ onAddPet, isLoading }: AlienPetFormProps) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [planet, setPlanet] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('species', species)
    formData.append('planet', planet)
    formData.append('description', description)
    if (image) {
      formData.append('image', image)
    }

    const response = await fetch('/api/alien-pets', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const newPet = await response.json()
      onAddPet(newPet)
      setName('')
      setSpecies('')
      setPlanet('')
      setDescription('')
      setImage(null)
      setPreviewUrl(null)
    } else {
      // Handle error
      console.error('Failed to add new alien pet')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-300">Pet Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Zorblax"
          required
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="species" className="text-gray-300">Species</Label>
        <Input
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Floofian"
          required
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="planet" className="text-gray-300">Home Planet</Label>
        <Input
          id="planet"
          value={planet}
          onChange={(e) => setPlanet(e.target.value)}
          placeholder="Nebula IX"
          required
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A lovable ball of cosmic fluff..."
          required
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image" className="text-gray-300">Pet Image</Label>
        <Input
          id="image"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="bg-gray-700 text-gray-100"
        />
      </div>
      {previewUrl && (
        <div className="mt-4">
          <Image src={previewUrl} alt="Preview" width={200} height={200} className="rounded-lg" />
        </div>
      )}
      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Alien Pet'
        )}
      </Button>
    </form>
  )
}
