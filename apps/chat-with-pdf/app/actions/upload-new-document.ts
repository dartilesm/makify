"use server";

export async function uploadNewDocument(formData: FormData) {
  const formDataEntries = Array.from(formData.entries());

  for (const [key, value] of formDataEntries) {
    console.log({ key, value });
  }
}
