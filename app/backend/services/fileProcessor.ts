import path from "path";
import fs from "fs/promises";
import * as xlsx from "xlsx";
import mammoth from "mammoth";
import * as pdfParse from "pdf-parse";
import { extractAndCreateFromText } from "./extract";
import Client from "../models/client";
import RawInput from "../models/rawInput";

type ProcessResult = {
  processedCount: number;
  createdIds: string[];
  rawIds: string[];
  summary?: Record<string, any>;
};

function normalizeHeader(h: string) {
  return (h || "").toString().trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function getCreatedId(created: any): string | null {
  if (!created) return null;
  if ((created as any)._id) {
    try {
      return String((created as any)._id);
    } catch {
      return null;
    }
  }
  if (Array.isArray(created) && created.length > 0 && (created[0] as any)._id) {
    try {
      return String((created[0] as any)._id);
    } catch {
      return null;
    }
  }
  if (created.insertedId) {
    return String(created.insertedId);
  }
  return null;
}

type FileSource = {
  buffer?: Buffer;
  filePath?: string | null;
};

function ensureSource(source: FileSource): asserts source is FileSource {
  if (!source.buffer && !source.filePath) {
    throw new Error("No file content provided");
  }
}

async function processSpreadsheet(source: FileSource) {
  ensureSource(source);
  const wb = source.buffer
    ? xlsx.read(source.buffer, { type: "buffer" })
    : xlsx.readFile(source.filePath as string);
  const createdIds: string[] = [];
  const rawIds: string[] = [];
  let processedCount = 0;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rows: any[] = (xlsx.utils.sheet_to_json(ws, { defval: null }) as any[]) || [];
    if (!rows || rows.length === 0) continue;

    const headers = Object.keys(rows[0] || {});
    const normalizedHeaders = headers.map(normalizeHeader);

    const hasClientName =
      normalizedHeaders.includes("client_name") || normalizedHeaders.includes("client");
    const hasDescription =
      normalizedHeaders.includes("description") ||
      normalizedHeaders.includes("text") ||
      normalizedHeaders.includes("notes");

    const clientNameKey = headers.find((h) => normalizeHeader(h) === "client_name");
    const contactKey = headers.find((h) => normalizeHeader(h) === "contact_person");
    const projectKey = headers.find((h) => normalizeHeader(h) === "project_title");
    const descKey = headers.find((h) => /desc/i.test(h) || /description/i.test(h));
    const hourlyKey = headers.find((h) => normalizeHeader(h) === "hourly_rate");
    const durationKey = headers.find((h) => normalizeHeader(h) === "duration_hours");
    const techKey = headers.find((h) => normalizeHeader(h) === "techstack_used");

    for (const row of rows) {
      processedCount++;

      const r: Record<string, any> = row as Record<string, any>;

      if (hasClientName && clientNameKey && r[clientNameKey]) {
        const payload: any = {
          client_name: r[clientNameKey] ?? null,
          contact_person: contactKey ? r[contactKey] ?? null : null,
          project_title: projectKey ? r[projectKey] ?? null : null,
          description: descKey ? r[descKey] ?? null : null,
          hourly_rate: hourlyKey ? r[hourlyKey] ?? null : null,
          duration_hours: durationKey ? r[durationKey] ?? null : null,
          techstack_used: techKey ? r[techKey] ?? null : null,
          source: "file_upload",
          source_metadata: { sheet: sheetName },
        };

        const created = await Client.create(payload);
        const id = getCreatedId(created);
        if (id) createdIds.push(id);
      } else if (hasDescription && descKey) {
        const text = String(r[descKey] ?? "");
        const raw = await RawInput.create({
          text,
          source: "file_upload",
          metadata: { sheet: sheetName },
        });
        if (raw && (raw as any)._id) rawIds.push(String((raw as any)._id));

        const res = await extractAndCreateFromText(String(text), {});
        if (res?.created) {
          const cid = getCreatedId(res.created);
          if (cid) createdIds.push(cid);
        }
      } else {
        const text = JSON.stringify(r);
        const raw = await RawInput.create({
          text,
          source: "file_upload",
          metadata: { sheet: sheetName },
        });
        if (raw && (raw as any)._id) rawIds.push(String((raw as any)._id));

        const res = await extractAndCreateFromText(String(text), {});
        if (res?.created) {
          const cid = getCreatedId(res.created);
          if (cid) createdIds.push(cid);
        }
      }
    }
  }

  return { processedCount, createdIds, rawIds };
}

async function processDocx(source: FileSource) {
  ensureSource(source);
  const buffer =
    source.buffer || (await fs.readFile(source.filePath as string));
  const res = await mammoth.extractRawText({ buffer });
  const text = res.value || "";
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const createdIds: string[] = [];
  const rawIds: string[] = [];
  let processedCount = 0;
  for (const para of paragraphs) {
    processedCount++;
    const r = await RawInput.create({ text: para, source: "file_upload" });
    if (r && (r as any)._id) rawIds.push(String((r as any)._id));
    const result = await extractAndCreateFromText(para, {});
    if (result?.created) {
      const cid = getCreatedId(result.created);
      if (cid) createdIds.push(cid);
    }
  }
  return { processedCount, createdIds, rawIds };
}

async function processPdf(source: FileSource) {
  ensureSource(source);
  const data = source.buffer || (await fs.readFile(source.filePath as string));
  const pdfResult: any = await (pdfParse as any)(data);
  const text = pdfResult?.text ?? "";
  const paragraphs = text.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
  const createdIds: string[] = [];
  const rawIds: string[] = [];
  let processedCount = 0;
  for (const para of paragraphs) {
    processedCount++;
    const r = await RawInput.create({ text: para, source: "file_upload" });
    if (r && (r as any)._id) rawIds.push(String((r as any)._id));
    const result = await extractAndCreateFromText(para, {});
    if (result?.created) {
      const cid = getCreatedId(result.created);
      if (cid) createdIds.push(cid);
    }
  }
  return { processedCount, createdIds, rawIds };
}

type UploadedFileInput = {
  buffer?: Buffer;
  filePath?: string | null;
  originalName?: string;
};

export async function processUploadedFile(file: UploadedFileInput): Promise<ProcessResult> {
  if (!file?.buffer && !file?.filePath) {
    throw new Error("No upload data provided");
  }

  const ext = path.extname(file.originalName || file.filePath || "").toLowerCase();
  const result: any = { processedCount: 0, createdIds: [], rawIds: [] };

  if ([".xlsx", ".xls", ".csv"].includes(ext)) {
    const res = await processSpreadsheet({ buffer: file.buffer, filePath: file.filePath });
    result.processedCount = res.processedCount ?? 0;
    result.createdIds = res.createdIds ?? [];
    result.rawIds = res.rawIds ?? [];
  } else if ([".docx"].includes(ext)) {
    const res = await processDocx({ buffer: file.buffer, filePath: file.filePath });
    result.processedCount = res.processedCount ?? 0;
    result.createdIds = res.createdIds ?? [];
    result.rawIds = res.rawIds ?? [];
  } else if ([".pdf"].includes(ext)) {
    const res = await processPdf({ buffer: file.buffer, filePath: file.filePath });
    result.processedCount = res.processedCount ?? 0;
    result.createdIds = res.createdIds ?? [];
    result.rawIds = res.rawIds ?? [];
  } else if ([".txt"].includes(ext)) {
    const txt = file.buffer
      ? file.buffer.toString("utf8")
      : await fs.readFile(file.filePath as string, "utf8");
    const paragraphs = txt.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    for (const para of paragraphs) {
      const r = await RawInput.create({ text: para, source: "file_upload" });
      if (r && (r as any)._id) result.rawIds.push(String((r as any)._id));
      const res = await extractAndCreateFromText(String(para), {});
      if (res?.created) {
        const cid = getCreatedId(res.created);
        if (cid) result.createdIds.push(cid);
      }
      result.processedCount++;
    }
  } else {
    const txt = file.buffer
      ? file.buffer.toString("utf8")
      : await fs.readFile(file.filePath as string, "utf8");
    const r = await RawInput.create({ text: txt, source: "file_upload" });
    if (r && (r as any)._id) result.rawIds.push(String((r as any)._id));
    const res = await extractAndCreateFromText(txt, {});
    if (res?.created) {
      const cid = getCreatedId(res.created);
      if (cid) result.createdIds.push(cid);
    }
    result.processedCount = 1;
  }

  result.summary = {
    originalName: file.originalName,
    processedCount: result.processedCount,
    created: (result.createdIds || []).length,
    rawSaved: (result.rawIds || []).length,
  };

  return result as ProcessResult;
}
