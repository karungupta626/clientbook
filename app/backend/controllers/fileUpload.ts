import { processUploadedFile } from "../services/fileProcessor";

type UploadPayload = {
  buffer?: Buffer;
  filePath?: string | null;
  originalName?: string;
};

export async function handleFileUpload(payload: UploadPayload) {
  if (!payload?.buffer && !payload?.filePath) {
    throw new Error("File data is missing");
  }

  const result = await processUploadedFile(payload);
  return result;
}