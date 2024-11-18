'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  email: string
  role: string
  createdAt: string
}

interface AlienPet {
  _id: string
  name: string
  species: string
  planet: string
  description: string
  imageUrl: string
  createdAt: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [pets, setPets] = useState<AlienPet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{type: 'user' | 'pet', id: string} | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([
      fetchUsers(),
      fetchPets()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      if (!Array.isArray(data)) throw new Error('Invalid users data format')
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users"
      })
    }
  }

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/admin/alien-pets')
      if (!response.ok) throw new Error('Failed to fetch pets')
      const data = await response.json()
      if (!Array.isArray(data)) throw new Error('Invalid pets data format')
      setPets(data)
    } catch (error) {
      console.error('Error fetching pets:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch alien pets"
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    setDeleting({ type: 'user', id: userId })
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      toast({
        title: "Success",
        description: "User deleted successfully"
      })

      setUsers(users.filter(user => user._id !== userId))
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user"
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this alien pet? This action cannot be undone.')) {
      return
    }

    setDeleting({ type: 'pet', id: petId })
    try {
      const response = await fetch('/api/admin/alien-pets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      toast({
        title: "Success",
        description: "Alien pet deleted successfully"
      })

      setPets(pets.filter(pet => pet._id !== petId))
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete alien pet"
      })
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-xl text-gray-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-red-500">{users.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Total Pets</h3>
          <p className="text-3xl font-bold text-red-500">{pets.length}</p>
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={deleting?.type === 'user' && deleting.id === user._id}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting?.type === 'user' && deleting.id === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alien Pets Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Alien Pets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Species
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Planet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pets.map((pet) => (
                <tr key={pet._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {pet.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {pet.species}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {pet.planet}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeletePet(pet._id)}
                      disabled={deleting?.type === 'pet' && deleting.id === pet._id}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting?.type === 'pet' && deleting.id === pet._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 