import { createServerSupabaseClient } from "@/lib/supabaseServer";
import type {
  Room,
  Task,
  RoomWithProgress,
  TaskWithProgress,
  OverallProgress,
  RoomStatus,
} from "./learningRooms.types";

function resolveField<T extends Record<string, unknown>>(
  record: T,
  fieldBase: string,
  locale: string
): string | null {
  const localizedKey = `${fieldBase}_${locale}`;
  if (locale === "de" && record[localizedKey]) {
    return String(record[localizedKey]);
  }
  const englishKey = `${fieldBase}_en`;
  const val = record[englishKey];
  return val ? String(val) : null;
}

function toRoomWithProgress(row: Record<string, unknown>): RoomWithProgress {
  return {
    id: String(row.id),
    slug: String(row.slug),
    room_number: Number(row.room_number),
    title_en: String(row.title_en),
    title_de: String(row.title_de),
    description_en: row.description_en ? String(row.description_en) : null,
    description_de: row.description_de ? String(row.description_de) : null,
    purpose_en: row.purpose_en ? String(row.purpose_en) : null,
    purpose_de: row.purpose_de ? String(row.purpose_de) : null,
    unlock_order: Number(row.unlock_order),
    is_active: Boolean(row.is_active),
    status: (row.status as RoomStatus) ?? "locked",
    progress_percentage: row.progress_percentage ? Number(row.progress_percentage) : 0,
    started_at: row.started_at ? String(row.started_at) : null,
    completed_at: row.completed_at ? String(row.completed_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : null,
    created_at: row.created_at ? String(row.created_at) : new Date().toISOString(),
  };
}

function toTaskWithProgress(row: Record<string, unknown>): TaskWithProgress {
  return {
    id: String(row.id),
    room_id: String(row.room_id),
    task_key: String(row.task_key),
    title_en: String(row.title_en),
    title_de: String(row.title_de),
    description_en: row.description_en ? String(row.description_en) : null,
    description_de: row.description_de ? String(row.description_de) : null,
    order_index: Number(row.order_index),
    completed: row.completed ? Boolean(row.completed) : false,
    completed_at: row.completed_at ? String(row.completed_at) : null,
    created_at: row.created_at ? String(row.created_at) : new Date().toISOString(),
  };
}

export function resolveRoomLocale(room: Room, locale: string) {
  return {
    ...room,
    title: resolveField(room, "title", locale) ?? room.title_en,
    description: resolveField(room, "description", locale),
    purpose: resolveField(room, "purpose", locale),
  };
}

export function resolveTaskLocale(task: Task, locale: string) {
  return {
    ...task,
    title: resolveField(task, "title", locale) ?? task.title_en,
    description: resolveField(task, "description", locale),
  };
}

/* ------------------------------------------------------------------ */
/* 1. getAllRooms                                                      */
/* ------------------------------------------------------------------ */
export async function getAllRooms(locale: string): Promise<
  Array<Room & { title: string; description: string | null; purpose: string | null }>
> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("learning_rooms")
    .select("*")
    .eq("is_active", true)
    .order("unlock_order", { ascending: true });

  if (error) throw new Error(error.message);

  const rooms = (data ?? []) as Room[];
  return rooms.map((room) => ({
    ...room,
    title: resolveField(room, "title", locale) ?? room.title_en,
    description: resolveField(room, "description", locale),
    purpose: resolveField(room, "purpose", locale),
  }));
}

/* ------------------------------------------------------------------ */
/* 2. getRoomBySlug                                                    */
/* ------------------------------------------------------------------ */
export async function getRoomBySlug(
  slug: string,
  locale: string
): Promise<
  | (Room & {
      title: string;
      description: string | null;
      purpose: string | null;
      tasks: Array<Task & { title: string; description: string | null }>;
    })
  | null
> {
  const supabase = createServerSupabaseClient();

  const { data: roomData, error: roomError } = await supabase
    .from("learning_rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (roomError || !roomData) return null;
  const room = roomData as Room;

  const { data: taskData, error: taskError } = await supabase
    .from("room_tasks")
    .select("*")
    .eq("room_id", room.id)
    .order("order_index", { ascending: true });

  if (taskError) throw new Error(taskError.message);

  const tasks = (taskData ?? []) as Task[];

  return {
    ...room,
    title: resolveField(room, "title", locale) ?? room.title_en,
    description: resolveField(room, "description", locale),
    purpose: resolveField(room, "purpose", locale),
    tasks: tasks.map((task) => ({
      ...task,
      title: resolveField(task, "title", locale) ?? task.title_en,
      description: resolveField(task, "description", locale),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* 3. initializeUserProgress                                           */
/* ------------------------------------------------------------------ */
export async function initializeUserProgress(userId: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { count, error: countError } = await supabase
    .from("student_room_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) throw new Error(countError.message);
  if ((count ?? 0) > 0) return; // already initialized

  const { data: rooms, error: roomsErr } = await supabase
    .from("learning_rooms")
    .select("id, unlock_order")
    .eq("is_active", true)
    .order("unlock_order", { ascending: true });

  if (roomsErr) throw new Error(roomsErr.message);

  const progressRows = (rooms ?? []).map((room) => ({
    user_id: userId,
    room_id: String(room.id),
    status: Number(room.unlock_order) === 1 ? "available" : "locked",
    progress_percentage: 0,
  }));

  if (progressRows.length === 0) return;

  const { error } = await supabase
    .from("student_room_progress")
    .upsert(progressRows, { onConflict: "user_id,room_id" });

  if (error && !error.message.includes("duplicate")) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* 4. getUserProgress                                                  */
/* ------------------------------------------------------------------ */
export async function getUserProgress(userId: string): Promise<RoomWithProgress[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("learning_rooms")
    .select(
      `*,
      student_room_progress(status, progress_percentage, started_at, completed_at, updated_at)`
    )
    .eq("is_active", true)
    .eq("student_room_progress.user_id", userId)
    .order("unlock_order", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Array<Record<string, unknown>>;

  // Fallback: if no rows returned (user has zero progress), fetch raw rooms
  if (rows.length === 0) {
    const { data: rawRooms, error: rawErr } = await supabase
      .from("learning_rooms")
      .select("*")
      .eq("is_active", true)
      .order("unlock_order", { ascending: true });

    if (rawErr) throw new Error(rawErr.message);
    return (rawRooms ?? []).map((r) =>
      toRoomWithProgress({
        ...(r as Record<string, unknown>),
        status: "locked",
        progress_percentage: 0,
        started_at: null,
        completed_at: null,
        updated_at: null,
      })
    );
  }

  return rows.map((row) => {
    const srp = (row.student_room_progress ?? {}) as Record<string, unknown>;
    return toRoomWithProgress({
      ...row,
      status: srp.status ?? "locked",
      progress_percentage: srp.progress_percentage ?? 0,
      started_at: srp.started_at ?? null,
      completed_at: srp.completed_at ?? null,
      updated_at: srp.updated_at ?? null,
    });
  });
}

/* ------------------------------------------------------------------ */
/* 5. getUserTaskProgress                                              */
/* ------------------------------------------------------------------ */
export async function getUserTaskProgress(
  userId: string,
  roomId: string
): Promise<TaskWithProgress[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("room_tasks")
    .select(
      `*,
      student_task_progress(completed, completed_at)`
    )
    .eq("room_id", roomId)
    .eq("student_task_progress.user_id", userId)
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Array<Record<string, unknown>>;

  // Fallback: if no rows returned, fetch raw tasks
  if (rows.length === 0) {
    const { data: rawTasks, error: rawErr } = await supabase
      .from("room_tasks")
      .select("*")
      .eq("room_id", roomId)
      .order("order_index", { ascending: true });

    if (rawErr) throw new Error(rawErr.message);
    return (rawTasks ?? []).map((t) =>
      toTaskWithProgress({
        ...(t as Record<string, unknown>),
        completed: false,
        completed_at: null,
      })
    );
  }

  return rows.map((row) => {
    const stp = (row.student_task_progress ?? {}) as Record<string, unknown>;
    return toTaskWithProgress({
      ...row,
      completed: stp.completed ?? false,
      completed_at: stp.completed_at ?? null,
    });
  });
}

/* ------------------------------------------------------------------ */
/* 6. markTaskCompleted                                                */
/* ------------------------------------------------------------------ */
export async function markTaskCompleted(userId: string, taskId: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  // Find the room this task belongs to
  const { data: taskData, error: taskErr } = await supabase
    .from("room_tasks")
    .select("room_id")
    .eq("id", taskId)
    .single();

  if (taskErr || !taskData) throw new Error(taskErr?.message ?? "Task not found");
  const roomId = String(taskData.room_id);

  // Upsert task progress
  const { error: upsertErr } = await supabase.from("student_task_progress").upsert(
    {
      user_id: userId,
      task_id: taskId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,task_id" }
  );

  if (upsertErr) throw new Error(upsertErr.message);

  // Recalculate room progress
  const { data: totalData, error: totalErr } = await supabase
    .from("room_tasks")
    .select("id", { count: "exact" })
    .eq("room_id", roomId);

  if (totalErr) throw new Error(totalErr.message);
  const totalTasks = (totalData ?? []).length;

  const { data: doneData, error: doneErr } = await supabase
    .from("student_task_progress")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .in(
      "task_id",
      (
        await supabase.from("room_tasks").select("id").eq("room_id", roomId)
      ).data?.map((t) => t.id) ?? []
    )
    .eq("completed", true);

  if (doneErr) throw new Error(doneErr.message);
  const completedTasks = (doneData ?? []).length;

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const allDone = completedTasks >= totalTasks && totalTasks > 0;

  const updatePayload: Record<string, unknown> = {
    progress_percentage: percentage,
    updated_at: new Date().toISOString(),
  };

  if (allDone) {
    updatePayload.status = "completed";
    updatePayload.completed_at = new Date().toISOString();
  }

  const { error: updateErr } = await supabase
    .from("student_room_progress")
    .update(updatePayload)
    .eq("user_id", userId)
    .eq("room_id", roomId);

  if (updateErr) throw new Error(updateErr.message);

  if (allDone) {
    await unlockNextRoom(userId, roomId);
  }
}

/* ------------------------------------------------------------------ */
/* 7. markRoomCompleted                                                */
/* ------------------------------------------------------------------ */
export async function markRoomCompleted(userId: string, roomId: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("student_room_progress")
    .update({
      status: "completed",
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("room_id", roomId);

  if (error) throw new Error(error.message);

  await unlockNextRoom(userId, roomId);
}

/* ------------------------------------------------------------------ */
/* 8. unlockNextRoom                                                   */
/* ------------------------------------------------------------------ */
export async function unlockNextRoom(userId: string, completedRoomId: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { data: roomData, error: roomErr } = await supabase
    .from("learning_rooms")
    .select("unlock_order")
    .eq("id", completedRoomId)
    .single();

  if (roomErr || !roomData) return;
  const currentOrder = Number(roomData.unlock_order);

  const { data: nextRoom, error: nextErr } = await supabase
    .from("learning_rooms")
    .select("id")
    .eq("is_active", true)
    .eq("unlock_order", currentOrder + 1)
    .single();

  if (nextErr || !nextRoom) return;
  const nextRoomId = String(nextRoom.id);

  const { error: updErr } = await supabase
    .from("student_room_progress")
    .update({ status: "available", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("room_id", nextRoomId)
    .eq("status", "locked");

  if (updErr) throw new Error(updErr.message);
}

/* ------------------------------------------------------------------ */
/* 9. setRoomActive                                                    */
/* ------------------------------------------------------------------ */
export async function setRoomActive(userId: string, roomId: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("student_room_progress")
    .update({
      status: "active",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("room_id", roomId)
    .eq("status", "available");

  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* 10. getOverallProgress                                              */
/* ------------------------------------------------------------------ */
export async function getOverallProgress(userId: string): Promise<OverallProgress> {
  const rooms = await getUserProgress(userId);

  const totalRooms = rooms.length;
  const completedRooms = rooms.filter((r) => r.status === "completed").length;
  const percentage = totalRooms > 0 ? Math.round((completedRooms / totalRooms) * 100) : 0;

  const currentRoom =
    rooms.find((r) => r.status === "active") ??
    rooms.find((r) => r.status === "available") ??
    null;

  let nextRecommendedRoom: RoomWithProgress | null = null;
  if (currentRoom) {
    const currentIndex = rooms.findIndex((r) => r.id === currentRoom.id);
    nextRecommendedRoom =
      rooms
        .slice(currentIndex + 1)
        .find((r) => r.status === "available" || r.status === "locked") ?? null;
  } else {
    nextRecommendedRoom = rooms.find((r) => r.status === "available") ?? null;
  }

  return {
    completedRooms,
    totalRooms,
    percentage,
    currentRoom,
    nextRecommendedRoom,
  };
}
