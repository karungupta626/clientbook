import RawInput from "../models/rawInput";
import Client from "../models/client";
import { connectDB } from "../db";
import { GoogleGenAI } from "@google/genai";

async function callLLMExtract(text: string) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error("Missing GEMINI_API_KEY in environment");
  const ai = new GoogleGenAI({});

  const prompt = `You are a JSON extractor. Input: a block of text describing a client engagement.
  Extract these fields (if present) and return exactly one JSON object with these keys:
  client_name, contact_person, project_title, description, start_date, end_date, duration_hours, hourly_rate, total_charge, address, client_profile, team, communication_platforms, tags, techstack_used
  If a field is not present, set it to null. Also return a "confidence_scores" object with per-field numbers between 0 and 1.
  Return only valid JSON and nothing else.

  Text:
  """${text}"""
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.0,
      },
    });
    return response.text;
  } catch (err) {
    throw new Error("LLM request failed: " + (err as Error).message);
  }
}

function extractJsonFromText(modelText: string) {
  const start = modelText.indexOf("{");
  const end = modelText.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model output");
  }
  const jsonStr = modelText.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    const cleaned = jsonStr.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    return JSON.parse(cleaned);
  }
}

export async function extractAndCreateFromText(rawText: string, opts: { userId?: string } = {}) {
  await connectDB();

  const raw = await RawInput.create({
    user_id: opts.userId || null,
    text: rawText,
    source: "manual",
  });

  const modelText = await callLLMExtract(rawText);

  if (!modelText) {
    throw new Error("Failed to extract text from LLM response");
  }

  const parsed = extractJsonFromText(modelText);

  const payload: any = {
    client_name: parsed.client_name ?? null,
    contact_person: parsed.contact_person ?? null,
    project_title: parsed.project_title ?? null,
    description: parsed.description ?? null,
    raw_input_id: raw._id,
    start_date: parsed.start_date ? new Date(parsed.start_date) : null,
    end_date: parsed.end_date ? new Date(parsed.end_date) : null,
    duration_hours: parsed.duration_hours ? Number(parsed.duration_hours) : null,
    hourly_rate: parsed.hourly_rate ? Number(parsed.hourly_rate) : null,
    total_charge: parsed.total_charge ? Number(parsed.total_charge) : null,
    address: parsed.address ?? null,
    client_profile: parsed.client_profile ?? null,
    team: Array.isArray(parsed.team) ? parsed.team : parsed.team ? [parsed.team] : [],
    communication_platforms: Array.isArray(parsed.communication_platforms)
      ? parsed.communication_platforms
      : parsed.communication_platforms
      ? [parsed.communication_platforms]
      : [],
    tags: Array.isArray(parsed.tags) ? parsed.tags : parsed.tags ? [parsed.tags] : [],
    techstack_used: Array.isArray(parsed.techstack_used)
      ? parsed.techstack_used
      : parsed.techstack_used
      ? (parsed.techstack_used + "").split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
    source: "file_upload",
    source_metadata: { extractor_model: "openai", raw_model_output: modelText },
    confidence_scores: parsed.confidence_scores ?? {},
  };

  if (!payload.client_name) {
    payload.status = "draft";
  }

  const created = await Client.create(payload);

  return { raw, parsed, created };
}
