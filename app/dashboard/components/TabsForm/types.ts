export type PayloadForServer = {
  client_name: string;
  contact_person?: string | null;
  project_title?: string | null;
  description?: string | null;
  hourly_rate?: number | null;
  duration_hours?: number | null;
  techstack_used?: string[];
};
