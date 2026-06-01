import { supabase }
from "./supabase.service";

export async function saveAnalysis(
  data: any
) {
  const { error } =
    await supabase
      .from("analyses")
      .insert(data);

  if (error) {
    throw error;
  }
}