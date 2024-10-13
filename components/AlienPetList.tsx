'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'
import AlienPetForm from './AlienPetForm'
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react'
import Loading from './loading'
import Link from 'next/link'

interface AlienPet {
  _id: string
  name: string
  species: string
  planet: string
  description: string
  imageUrl: string
}

interface AlienPetListProps {
  initialPets: AlienPet[]
  loading: boolean
}

export default function AlienPetList({ initialPets, loading }: AlienPetListProps) {  
  const [pets, setPets] = useState<AlienPet[]>([])
  const [editingPet, setEditingPet] = useState<AlienPet | null>(null)
  const [isAddingPet, setIsAddingPet] = useState(false)
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null)
  const [updatingPetId, setUpdatingPetId] = useState<string | null>(null)
  const [isAddingLoading, setIsAddingLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setPets(initialPets)
  }, [initialPets])

  async function handleDelete(id: string) {
    setDeletingPetId(id)
    try {
      const response = await fetch(`/api/alien-pets/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setPets(prevPets => prevPets.filter(pet => pet._id !== id))
        toast({
          title: "Success",
          description: "Alien pet deleted successfully!",
        })
      } else {
        throw new Error('Failed to delete alien pet')
      }
    } catch (error) {
      console.error('Error deleting pet:', error)
      toast({
        title: "Error",
        description: "Failed to delete alien pet.",
        variant: "destructive",
      })
    } finally {
      setDeletingPetId(null)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingPet) return

    setUpdatingPetId(editingPet._id)
    try {
      const { _id, ...petWithoutId } = editingPet
      const response = await fetch(`/api/alien-pets/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petWithoutId),
      })
      if (response.ok) {
        setPets(prevPets => prevPets.map(pet => pet._id === _id ? editingPet : pet))
        setEditingPet(null)
        toast({
          title: "Success",
          description: "Alien pet updated successfully!",
        })
      } else {
        throw new Error('Failed to update alien pet')
      }
    } catch (error) {
      console.error('Error updating pet:', error)
      toast({
        title: "Error",
        description: "Failed to update alien pet.",
        variant: "destructive",
      })
    } finally {
      setUpdatingPetId(null)
    }
  }

  function handleEditInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!editingPet) return
    setEditingPet({ ...editingPet, [e.target.id.replace('edit-', '')]: e.target.value })
  }

  async function handleAddPet(newPet: AlienPet) {
    setIsAddingLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPets(prevPets => [...prevPets, newPet])
      setIsAddingPet(false)
      toast({
        title: "Success",
        description: "New alien pet added successfully!",
      })
    } catch (error) {
      console.error('Error adding pet:', error)
      toast({
        title: "Error",
        description: "Failed to add new alien pet.",
        variant: "destructive",
      })
    } finally {
      setIsAddingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <Dialog open={isAddingPet} onOpenChange={setIsAddingPet}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Alien Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-2xl text-red-500">Add New Alien Pet</DialogTitle>
            </DialogHeader>
            <AlienPetForm onAddPet={handleAddPet} isLoading={isAddingLoading} />
          </DialogContent>
        </Dialog>
      </div>

      {pets.length === 0 ? (
        <div className='text-center text-gray-300'>No alien pets available. Add one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map(pet => (
            <Card key={pet._id} className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/alien-pets/${pet._id}`}>
                <CardHeader className="relative p-0">
                  <Image src={pet.imageUrl} alt={pet.name} width={400} height={300} className="w-full h-48 object-cover" />
                  <CardTitle className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4 text-2xl text-white">
                    {pet.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-red-300"><strong>Species:</strong> {pet.species}</p>
                  <p className="text-red-300"><strong>Home Planet:</strong> {pet.planet}</p>
                  <p className="text-gray-300 mt-2 line-clamp-3">{pet.description}</p>
                </CardContent>
              </Link>
              <CardFooter className="justify-between p-4 bg-gray-900">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setEditingPet(pet)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-red-300">Edit Alien Pet</DialogTitle>
                    </DialogHeader>
                    {editingPet && (
                      <form onSubmit={handleUpdate} className="space-y-4">
                        {['name', 'species', 'planet'].map(field => (
                          <div key={field} className="space-y-2">
                            <Label htmlFor={`edit-${field}`} className="text-gray-300 capitalize">{field}</Label>
                            <Input
                              id={`edit-${field}`}
                              value={editingPet[field as keyof AlienPet]}
                              onChange={handleEditInputChange}
                              required
                              className="bg-gray-700 text-gray-100"
                            />
                          </div>
                        ))}
                        <div className="space-y-2">
                          <Label htmlFor="edit-description" className="text-gray-300">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={editingPet.description}
                            onChange={handleEditInputChange}
                            required
                            className="bg-gray-700 text-gray-100"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-red-600 hover:bg-red-700"
                          disabled={updatingPetId === pet._id}
                        >
                          {updatingPetId === pet._id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            'Update Pet'
                          )}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(pet._id)}
                  disabled={deletingPetId === pet._id}
                >
                  {deletingPetId === pet._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
