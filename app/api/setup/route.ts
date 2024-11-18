import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@galactic.com" });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await User.create({
      email: "admin@galactic.com",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      { 
        message: "Admin user created successfully",
        credentials: {
          email: "admin@galactic.com",
          password: "admin123"
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating admin user" },
      { status: 500 }
    );
  }
} 