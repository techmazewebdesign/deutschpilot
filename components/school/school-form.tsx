"use client";

import { useState, type FormEvent } from "react";

export type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: string;
  hint?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  multiple?: boolean;
};
export function SchoolForm({
  title,
  description,
  fields,
  submit,
  action,
  disabled = false,
}: {
  title: string;
  description?: string;
  fields: Field[];
  submit: string;
  action: (data: Record<string, string>, form: HTMLFormElement) => Promise<void>;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setPending(true);
    try {
      const data = Object.fromEntries(
        Array.from(new FormData(form).entries()).filter(([, v]) => typeof v === "string")
      ) as Record<string, string>;
      for (const field of fields) {
        if (field.multiple) data[field.name] = new FormData(form).getAll(field.name).join(",");
      }
      await action(data, form);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="school-form" onSubmit={send} aria-label={title}>
      <h3>{title}</h3>
      {description && <p className="school-muted">{description}</p>}
      <fieldset disabled={pending || disabled}>
        <div className="school-fields">
          {fields.map((field) => (
            <label
              key={field.name}
              className={field.type === "textarea" ? "school-field school-wide" : "school-field"}
            >
              <span>
                {field.label}
                {field.required ? " *" : ""}
              </span>
              {field.options ? (
                <select
                  name={field.name}
                  multiple={field.multiple}
                  required={field.required}
                  defaultValue={
                    field.multiple ? (field.value?.split(",") ?? []) : (field.value ?? "")
                  }
                >
                  {!field.multiple && <option value="">—</option>}
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  defaultValue={field.value}
                  rows={3}
                  maxLength={field.maxLength ?? 4000}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  defaultValue={field.type === "file" ? undefined : field.value}
                  min={field.min}
                  max={field.max}
                  maxLength={field.type === "file" ? undefined : 500}
                  accept={
                    field.type === "file" ? "application/pdf,image/jpeg,image/png" : undefined
                  }
                />
              )}
              {field.hint && <small>{field.hint}</small>}
            </label>
          ))}
        </div>
        <button className="school-button" type="submit" aria-busy={pending}>
          {pending ? "…" : submit}
        </button>
      </fieldset>
      {error && (
        <p className="school-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
