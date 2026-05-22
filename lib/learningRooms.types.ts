export type RoomStatus = "locked" | "available" | "active" | "completed";

export interface Room {
  id: string;
  slug: string;
  room_number: number;
  title_en: string;
  title_de: string;
  description_en: string | null;
  description_de: string | null;
  purpose_en: string | null;
  purpose_de: string | null;
  unlock_order: number;
  is_active: boolean;
  created_at: string;
  [key: string]: unknown;
}

export interface Task {
  id: string;
  room_id: string;
  task_key: string;
  title_en: string;
  title_de: string;
  description_en: string | null;
  description_de: string | null;
  order_index: number;
  created_at: string;
  [key: string]: unknown;
}

export interface RoomProgress {
  id: string;
  user_id: string;
  room_id: string;
  status: RoomStatus;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface TaskProgress {
  id: string;
  user_id: string;
  task_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface RoomWithProgress extends Room {
  status: RoomStatus;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
}

export interface TaskWithProgress extends Task {
  completed: boolean;
  completed_at: string | null;
}

export interface OverallProgress {
  completedRooms: number;
  totalRooms: number;
  percentage: number;
  currentRoom: RoomWithProgress | null;
  nextRecommendedRoom: RoomWithProgress | null;
}
