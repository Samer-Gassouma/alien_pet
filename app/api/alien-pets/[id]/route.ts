import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI as string
const DB_NAME = 'galactic_pets'
const COLLECTION_NAME = 'alien_pets'

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables')
}

const client = new MongoClient(MONGODB_URI)

async function connectToDatabase() {
  await client.connect()
  return client.db(DB_NAME).collection(COLLECTION_NAME)
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  let collection

  try {
    collection = await connectToDatabase()
    const pet = await collection.findOne({ _id: new ObjectId(id) })

    if (!pet) {
      return NextResponse.json({ error: 'Alien pet not found' }, { status: 404 })
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error('Failed to fetch alien pet:', error)
    return NextResponse.json({ error: 'Failed to fetch alien pet' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  let collection

  try {
    collection = await connectToDatabase()
    const updatedPet = await request.json()

    const { _id, ...petWithoutId } = updatedPet

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: petWithoutId }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Alien pet not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Alien pet updated successfully' })
  } catch (error) {
    console.error('Failed to update alien pet:', error)
    return NextResponse.json({ error: 'Failed to update alien pet' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  let collection

  try {
    collection = await connectToDatabase()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Alien pet not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Alien pet deleted successfully' })
  } catch (error) {
    console.error('Failed to delete alien pet:', error)
    return NextResponse.json({ error: 'Failed to delete alien pet' }, { status: 500 })
  } finally {
    await client.close()
  }
}
