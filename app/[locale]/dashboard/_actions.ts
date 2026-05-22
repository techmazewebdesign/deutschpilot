"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { auth } from "@/lib/auth";
import {
  markTaskCompleted,
  markRoomCompleted,
  setRoomActive,
  getRoomBySlug,
} from "@/lib/learningRooms";

async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: you must be signed in.");
  }
  return { id: session.user.id, email: session.user.email };
}

/* ------------------------------------------------------------------ */
/* completeTaskAction                                                 */
/* ------------------------------------------------------------------ */
export async function completeTaskAction(taskId: string, locale: string) {
  const user = await getCurrentUser();
  await markTaskCompleted(user.id, taskId);

  // Revalidate dashboard & rooms list unconditionally
  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/rooms`);

  // Try to revalidate the specific room page
  const supabase = createServerSupabaseClient();
  const { data: taskData } = await supabase
    .from("room_tasks")
    .select("room_id")
    .eq("id", taskId)
    .single();

  if (taskData) {
    const { data: roomData } = await supabase
      .from("learning_rooms")
      .select("slug")
      .eq("id", taskData.room_id)
      .single();

    if (roomData?.slug) {
      revalidatePath(`/${locale}/dashboard/rooms/${roomData.slug}`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* completeRoomAction                                                 */
/* ------------------------------------------------------------------ */
export async function completeRoomAction(roomSlug: string, locale: string) {
  const user = await getCurrentUser();
  const room = await getRoomBySlug(roomSlug, locale);
  if (!room) throw new Error("Room not found.");

  await markRoomCompleted(user.id, room.id);

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/rooms`);
  revalidatePath(`/${locale}/dashboard/rooms/${roomSlug}`);
}

/* ------------------------------------------------------------------ */
/* activateRoomAction                                                 */
/* ------------------------------------------------------------------ */
export async function activateRoomAction(roomSlug: string, locale: string) {
  const user = await getCurrentUser();
  const room = await getRoomBySlug(roomSlug, locale);
  if (!room) throw new Error("Room not found.");

  await setRoomActive(user.id, room.id);

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/rooms`);
  revalidatePath(`/${locale}/dashboard/rooms/${roomSlug}`);
}
