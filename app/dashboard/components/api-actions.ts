import axios from "axios";

export type AddClientPayload = {
  client_name: string;
  contact_person?: string | null;
  project_title?: string | null;
  description?: string | null;
  hourly_rate?: number | null;
  duration_hours?: number | null;
  techstack_used?: string[];
};

export async function addClient(payload: AddClientPayload) {
  const res = await axios.post("/api/client", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
