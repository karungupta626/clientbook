"use client";

import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clientSchema, { type ClientFormValues } from "./validationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import TabsForm from "./TabsForm";
import { addClient } from "../api-actions";
import { AddClientPayload } from "../api-actions";
import axios from "axios";

interface Props {
  onSuccess?: (data: any) => void;
  onClose?: () => void;
}

export default function AddForm({ onSuccess, onClose }: Props) {
  const queryClient = useQueryClient();
  const [networkError, setNetworkError] = useState("");

  const methods = useForm<ClientFormValues>({
    resolver: yupResolver(clientSchema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: AddClientPayload) => addClient(payload),
    onMutate: () => {
      setNetworkError("");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      methods.reset();
      if (onSuccess) onSuccess(data);
      if (onClose) onClose();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        if (status === 409 && data?.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            // @ts-ignore
            methods.setError(field, { message: String(message) });
          });
          setNetworkError(Object.values(data.errors).join("\n"));
        } else {
          setNetworkError("Oops! Something went wrong. Please try again.");
        }
      } else {
        setNetworkError("Network error. Please try again.");
      }
    },
  });

  const isSubmitting = (mutation as any).isLoading ?? mutation.status === "pending";

  const onSubmit = (values: ClientFormValues) => {
    const payload: AddClientPayload = {
      client_name: values.client_name,
      contact_person: values.contact_person ?? null,
      project_title: values.project_title ?? null,
      description: values.description ?? null,
      hourly_rate: values.hourly_rate && values.hourly_rate !== "" ? Number(values.hourly_rate) : null,
      duration_hours: values.duration_hours && values.duration_hours !== "" ? Number(values.duration_hours) : null,
      techstack_used:
        values.techstack_used && values.techstack_used !== ""
          ? (values.techstack_used as unknown as string).split(",").map((s) => s.trim()).filter(Boolean)
          : [],
    };

    mutation.mutate(payload);
  };

  const onCancel = () => {
    methods.reset();
    setNetworkError("");
    if (onClose) onClose();
  };

  return (
    <FormProvider {...methods}>
      <TabsForm
        isSubmitting={isSubmitting}
        error={networkError}
        onSubmit={onSubmit}
        onClose={onCancel}
        submitButtonText="Save"
        inProgressButtonText="Saving…"
      />
    </FormProvider>
  );
}
