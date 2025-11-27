"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TabsFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const upload = async () => {
    if (!file) {
      alert("Select a file first.");
      return;
    }

    try {
      setLoading(true);
      setSummary(null);

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const json = await res.json();

      if (res.ok && json?.success) {
        alert("Upload processed successfully.");
        setSummary(JSON.stringify(json.summary || json.data || {}, null, 2));
        setFile(null);
        window.dispatchEvent(new CustomEvent("clientbook:created"));
      } else {
        console.error("Upload error", json);
        alert("Upload failed: " + (json?.message || "Server error"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Unexpected error: " + (err?.message ?? "unknown"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg w-full max-w-3xl">
      <input
        type="file"
        accept=".xlsx,.xls,.csv,.docx,.pdf,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded w-full"
      />
      <div className="flex gap-3 mt-4">
        <Button onClick={upload} disabled={!file || loading}>
          {loading ? "Uploading…" : "Upload & Process"}
        </Button>

        <Button variant="outline" onClick={() => { setFile(null); setSummary(null); }} disabled={loading}>
          Clear
        </Button>
      </div>

      {summary && (
        <pre className="mt-4 p-3 rounded bg-zinc-50 text-xs overflow-auto max-h-60">{summary}</pre>
      )}
    </div>
  );
}
