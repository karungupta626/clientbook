import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/db";
import { handleFileUpload } from "@/app/backend/controllers/fileUpload";

export const runtime = "nodejs";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, message: "No file in upload" }, { status: 400 });
    }
    const originalName = file.name || "uploaded-file";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await handleFileUpload({ buffer, originalName });

    return NextResponse.json(
      { success: true, data: result, summary: result.summary || null },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("upload route error", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
