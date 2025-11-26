"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    if (u === "admin" && p === "admin123") {
      document.cookie = "clientbook_auth=true; path=/;";
      window.location.href = "/dashboard";
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 p-6 rounded-xl bg-white shadow">
        <h1 className="text-xl font-bold mb-3">Admin Login</h1>

        <div className="flex flex-col gap-3">
          <Input placeholder="Username" value={u} onChange={(e) => setU(e.target.value)} />
          <Input placeholder="Password" type="password" value={p} onChange={(e) => setP(e.target.value)} />
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </div>
      </div>
    </div>
  );
}
