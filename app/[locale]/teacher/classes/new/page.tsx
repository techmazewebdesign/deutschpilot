"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video, Loader2 } from "lucide-react";

export default function CreateClassPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "A1",
    start_date: "",
    start_time: "10:00",
    duration_minutes: "60",
    max_students: "10",
    meet_url: "",
    status: "draft",
  });

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.start_date) {
      setError("Title and start date are required.");
      return;
    }
    setSaving(true);
    try {
      const start_time = new Date(`${form.start_date}T${form.start_time}:00`).toISOString();
      const res = await fetch("/api/teacher/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          level: form.level,
          start_time,
          duration_minutes: parseInt(form.duration_minutes) || 60,
          max_students: parseInt(form.max_students) || 10,
          meet_url: form.meet_url.trim() || null,
          status: form.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create class");
      router.push(`/${locale}/teacher/dashboard`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full bg-[#0A1E35]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E0B873]/50 transition-colors";
  const labelCls = "block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-screen bg-[#071424] px-4 py-10">
      <div className="max-w-xl mx-auto">
        <Link
          href={`/${locale}/teacher/dashboard`}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-[#E0B873]/15 flex items-center justify-center">
            <Video className="h-5 w-5 text-[#E0B873]" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">Create Live Class</h1>
            <p className="text-xs text-white/40">Fill in the details and set your Google Meet link.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-[#0A1E35]/70 border border-white/10 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className={labelCls}>Class Title *</label>
            <input
              className={inputCls}
              placeholder="e.g. A1 German for Beginners"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="What will students learn in this class?"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Level</label>
              <select className={inputCls} value={form.level} onChange={(e) => set("level", e.target.value)}>
                {["A1", "A2", "B1", "B2", "C1"].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="active">Active (visible)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date *</label>
              <input
                type="date"
                className={inputCls}
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Time</label>
              <input
                type="time"
                className={inputCls}
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Duration (minutes)</label>
              <input
                type="number"
                className={inputCls}
                value={form.duration_minutes}
                min={15}
                max={240}
                onChange={(e) => set("duration_minutes", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Max Students</label>
              <input
                type="number"
                className={inputCls}
                value={form.max_students}
                min={1}
                max={100}
                onChange={(e) => set("max_students", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Google Meet Link</label>
            <input
              className={inputCls}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={form.meet_url}
              onChange={(e) => set("meet_url", e.target.value)}
            />
            <p className="text-xs text-white/30 mt-1">Paste your Google Meet link here. You can add it later too.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-bold text-sm py-3 rounded-xl hover:bg-[#C99B50] transition-colors disabled:opacity-60"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create Class"}
          </button>
        </form>
      </div>
    </div>
  );
}
