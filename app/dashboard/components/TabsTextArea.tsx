"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TabsTextArea() {
  const [text, setText] = useState("");

  const handleParse = () => {
    console.log("Text Submitted →", text);
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg w-full max-w-3xl">
      <Textarea
        className="h-48"
        placeholder="Paste client details here..."
        onChange={(e) => setText(e.target.value)}
      />

      <Button className="mt-4" onClick={handleParse}>
        Parse with AI
      </Button>
    </div>
  );
}
