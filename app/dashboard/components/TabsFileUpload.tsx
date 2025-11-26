"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TabsFileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const upload = () => {
    console.log("Uploaded File →", file);
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg w-full max-w-3xl">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded w-full"
      />
      <Button className="mt-4" onClick={upload}>
        Upload & Process
      </Button>
    </div>
  );
}
