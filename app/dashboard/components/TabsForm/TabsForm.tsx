"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ClientFormValues } from "./validationSchema";

interface Props {
  error?: string;
  isSubmitting: boolean;
  submitButtonText?: string;
  inProgressButtonText?: string;
  onSubmit: (data: ClientFormValues) => void;
  onClose?: () => void;
}

export default function TabsFormInner({
  error,
  isSubmitting,
  submitButtonText = "Save",
  inProgressButtonText = "Saving…",
  onSubmit,
  onClose,
}: Props) {
  const methods = useFormContext<ClientFormValues>();

  return (
    <div className="relative">
      <form className="p-4 md:p-5" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="max-h-[65vh] overflow-auto mb-4 px-2">
          <div className="grid gap-3 grid-cols-2 mb-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Client Name *</label>
              <Input {...methods.register("client_name")} placeholder="Client name" />
              {methods.formState.errors.client_name && (
                <p className="mt-1 text-xs text-red-600">
                  {String(methods.formState.errors.client_name.message)}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Contact Person</label>
              <Input {...methods.register("contact_person")} placeholder="Contact person" />
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2 mb-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Project Title</label>
              <Input {...methods.register("project_title")} placeholder="Project title" />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Hourly Rate</label>
              <Input {...methods.register("hourly_rate")} placeholder="Hourly rate" />
              {methods.formState.errors.hourly_rate && (
                <p className="mt-1 text-xs text-red-600">{String(methods.formState.errors.hourly_rate.message)}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2 mb-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Total Hours</label>
              <Input {...methods.register("duration_hours")} placeholder="Total hours worked" />
              {methods.formState.errors.duration_hours && (
                <p className="mt-1 text-xs text-red-600">{String(methods.formState.errors.duration_hours.message)}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Tech Stack</label>
              <Input {...methods.register("techstack_used")} placeholder="Comma separated (React, Node.js)" />
            </div>
          </div>

          <div className="mb-2">
            <label className="text-xs font-medium mb-1 block">Description</label>
            <Textarea {...methods.register("description")} placeholder="Description / notes" className="min-h-[120px]" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <div className="p-3 text-sm text-red-500 rounded-lg bg-red-50 w-full whitespace-pre-line" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? inProgressButtonText : submitButtonText}
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => {
              methods.reset();
              if (onClose) onClose();
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
