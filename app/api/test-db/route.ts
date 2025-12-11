import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const developerCount = await prisma.developer.count();
    
    return NextResponse.json({
      status: "ok",
      message: "Database connected successfully",
      developerCount,
      prismaVersion: "7.1.0",
      database: "SQLite"
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      error: String(error)
    }, { status: 500 });
  }
}
