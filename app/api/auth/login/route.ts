import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email is wrong"),
  password: z.string().min(1, "Password is required"),
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

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const developer = await prisma.developer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!developer) {
      return NextResponse.json(
        { message: "Email or password is wrong" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, developer.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email or password is wrong" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        developerId: developer.id,
        role: developer.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...developerWithoutPassword } = developer;

    return NextResponse.json(
      {
        message: "Login successful",
        developer: developerWithoutPassword,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
