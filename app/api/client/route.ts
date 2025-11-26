import { createClient, getAllClients } from "@/app/backend/controllers/client";
import { connectDB } from "@/app/backend/db";
import { NextRequest } from "next/server";

export async function GET() {
  await connectDB();
  return getAllClients();
}

export async function POST(req: NextRequest) {
  await connectDB();
  return createClient(req);
}
