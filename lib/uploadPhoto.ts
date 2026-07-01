import { supabase } from "./supabase";

export async function uploadPhoto(
  file: File
) {
  const fileName =
    `${Date.now()}-${file.name}`;

  const { data, error } =
    await supabase.storage
      .from("checkin-photos")
      .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data: publicUrl } =
    supabase.storage
      .from("checkin-photos")
      .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}