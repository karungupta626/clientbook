import { extractAndCreateFromText } from "../services/extract";

export async function handleExtract(reqBody: any) {
  const { text, userId } = reqBody;
  if (!text || typeof text !== "string") {
    throw new Error("Missing text in request body");
  }
  const result = await extractAndCreateFromText(text, { userId });
  return result;
}