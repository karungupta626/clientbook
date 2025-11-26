import { handleExtract } from "@/app/backend/controllers/extract";
import { connectDB } from "@/app/backend/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const result = await handleExtract(body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err: any) {
    console.error("extract route error", err);
    return NextResponse.json({ success: false, message: err?.message ?? "Server error" }, { status: 500 });
  }
}