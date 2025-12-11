// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is too short").max(50),
    email: z.string().email("Email is invalid"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    role: z.enum(["DEVELOPER", "MANAGER", "ADMIN"]).optional().default("DEVELOPER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmation do not match",
    path: ["confirmPassword"],
  });

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { message: "Server configuration error: JWT_SECRET not set" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existingDeveloper = await prisma.developer.findUnique({
      where: { email },
    });

    if (existingDeveloper) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const developer = await prisma.developer.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      {
        developerId: developer.id,
        role: developer.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" } 
    );

    return NextResponse.json(
      {
        message: "Account created successfully",
        developer,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("prisma")) {
        return NextResponse.json(
          { message: "Database connection error. Please check your DATABASE_URL." },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
