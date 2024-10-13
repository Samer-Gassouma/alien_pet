import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { writeFile } from 'fs/promises'
import path from 'path'

const client = new MongoClient(process.env.MONGODB_URI as string)

export async function GET() {
  try {
    await client.connect()
    const db = client.db('galactic_pets')
    const pets = await db.collection('alien_pets').find().toArray()
    return NextResponse.json(pets)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alien pets' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const species = formData.get('species') as string
    const planet = formData.get('planet') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File | null

    let imageUrl = ''

    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const filename = Date.now() + '-' + image.name
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
      await writeFile(filepath, buffer)
      imageUrl = `/uploads/${filename}`
    }

    await client.connect()
    const db = client.db('galactic_pets')
    const result = await db.collection('alien_pets').insertOne({
      name,
      species,
      planet,
      description,
      imageUrl
    })

    const newPet = {
      _id: result.insertedId.toString(),
      name,
      species,
      planet,
      description,
      imageUrl
    }

    return NextResponse.json(newPet, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to add alien pet' }, { status: 500 })
  } finally {
    await client.close()
  }
}
