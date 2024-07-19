"use server";

export async function uploadNewDocument(formData: FormData) {
  const file = formData.get("pdf-file") as File;
  const fileLink = formData.get("pdf-link") as string;

  console.log({
    file,
    fileLink,
  });
}
