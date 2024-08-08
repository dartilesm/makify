"use server";

import { prisma } from "@/lib/prisma";

export async function submitFeedback({
  type,
  message,
}: {
  type: string;
  message: string;
}) {
  if (!type || !message) {
    throw new Error("Type and message are required");
  }

  await prisma.feedback.create({
    data: {
      type,
      message,
    },
  });
}
