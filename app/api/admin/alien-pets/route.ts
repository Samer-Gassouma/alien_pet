import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from 'mongoose';

// Create Alien Pet Schema
const alienPetSchema = new mongoose.Schema({
  name: String,
  species: String,
  planet: String,
  description: String,
  imageUrl: String,
}, { 
  timestamps: true,
  collection: 'alien_pets' // Explicitly set the collection name to match your DB
});

// Get or create model
const AlienPet = mongoose.models.alien_pets || mongoose.model('alien_pets', alienPetSchema);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Current session in alien-pets:", session); // Debug log
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      console.log("Unauthorized access attempt:", session?.user); // Debug log
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    console.log("Fetching alien pets...");

    // Use the raw collection name to query directly if needed
    const pets = await mongoose.connection.db.collection('alien_pets').find({}).toArray();

    console.log("Found pets:", pets);

    return NextResponse.json(pets);
  } catch (error) {
    console.error("Error in GET /api/admin/alien-pets:", error);
    return NextResponse.json(
      { message: "Error fetching alien pets" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { petId } = await req.json();

    if (!petId) {
      return NextResponse.json(
        { message: "Pet ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    await mongoose.connection.db.collection('alien_pets').deleteOne({ _id: new mongoose.Types.ObjectId(petId) });

    return NextResponse.json(
      { message: "Alien pet deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting alien pet" },
      { status: 500 }
    );
  }
} 