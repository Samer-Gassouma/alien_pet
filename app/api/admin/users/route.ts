import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Current session:", session); // Debug log
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      console.log("Unauthorized access attempt:", session?.user); // Debug log
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    console.log("Fetching users...");

    const users = await User.find({})
      .select('email role createdAt')
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found users:", users);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Delete attempt session:", session); // Debug log
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      console.log("Unauthorized delete attempt:", session?.user); // Debug log
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Prevent admin from deleting themselves
    const adminUser = await User.findById(userId);
    if (adminUser.email === session.user.email) {
      return NextResponse.json(
        { message: "Cannot delete your own admin account" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/admin/users:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
} 