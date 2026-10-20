import { createLearningProgressHandler } from "@/lib/learningProgressClient";
import {
  checkMutationOrigin,
  schoolIdentity,
  syncSchoolLearningProgress,
} from "@/lib/school/server";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createLearningProgressHandler({
  origin: checkMutationOrigin,
  identity: schoolIdentity,
  lessonCourse: async (lessonId) => {
    const { data, error } = await createAdminSupabaseClient()
      .from("lessons")
      .select("course_id")
      .eq("id", lessonId)
      .maybeSingle();
    if (error) throw new Error("Lesson lookup unavailable");
    return data?.course_id || null;
  },
  save: async (userId, input) => {
    const { error } = await createAdminSupabaseClient().rpc("save_learning_progress", {
      p_user_id: userId,
      p_lesson_id: input.lessonId,
      p_course_id: input.courseId,
      p_score: input.score,
      p_completed: input.completed,
    });
    if (error) throw new Error("Progress storage unavailable");
  },
  sync: syncSchoolLearningProgress,
});
