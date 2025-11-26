"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TabsTextArea() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) {
      alert("Please paste some text first.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();

      if (res.ok && json?.success) {
        alert("Data extracted and saved successfully.");
        setText("");
        window.dispatchEvent(new CustomEvent("clientbook:created", { detail: json.data }));
      } else {
        console.error("Extraction error", json);
        alert("Extraction failed: " + (json?.message || "Server error"));
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
      <Textarea
        className="h-48"
        placeholder="Paste client details here (paragraph or multi-line)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-4 flex gap-3">
        <Button onClick={handleParse} disabled={loading}>
          {loading ? "Processing…" : "Parse & Save"}
        </Button>
        <Button variant="outline" onClick={() => setText("")} disabled={loading}>
          Clear
        </Button>
      </div>
    </div>
  );
}
