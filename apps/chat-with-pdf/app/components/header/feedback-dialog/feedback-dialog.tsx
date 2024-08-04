"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@makify/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

const FeedbackSchema = z.object({
  type: z.union([
    z.literal("Improvement", {
      message: "Please select the type of feedback.",
    }),
    z.literal("Bug or error", {
      message: "Please select the type of feedback.",
    }),
    z.literal("General feedback", {
      message: "Please select the type of feedback.",
    }),
  ]),
  message: z
    .string({
      message: "Please provide a message.",
    })
    .min(20, {
      message: "Please provide a message with at least 20 characters.",
    })
    .max(500),
});

type FeedbackDialogProps = {
  triggerEl: React.ReactNode;
};

export function FeedbackDialog({ triggerEl }: FeedbackDialogProps) {
  const feedbackForm = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    mode: "onBlur",
  });

  // TODO: Abstract this function to a utility function
  function resizeTextarea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function handleOnOpenChange(isOpen: boolean) {
    if (!isOpen) {
      feedbackForm.reset();
      feedbackForm.clearErrors();
    }
  }

  return (
    <Dialog onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>{triggerEl}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send us your feedback</DialogTitle>
          <DialogDescription>
            We'd love to hear from you! Please share your thoughts with us and
            help us improve.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...feedbackForm}>
            <form>
              <FormField
                control={feedbackForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger onBlur={field.onBlur}>
                          <SelectValue placeholder="Select the type of feedback" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Improvement">
                          Suggest an improvement
                        </SelectItem>
                        <SelectItem value="Bug or error">
                          Report a bug or error
                        </SelectItem>
                        <SelectItem value="General feedback">
                          General feedback
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Please select the type of feedback you'd like to share. Is
                      it a suggestion for improvement, a bug or error report, or
                      general feedback?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={feedbackForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="max-h-28"
                        onChange={(event) => {
                          resizeTextarea(event);
                          field.onChange(event);
                        }}
                        maxLength={500}
                      />
                    </FormControl>
                    <FormDescription>
                      Feel free to share your thoughts with us.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleOnOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !feedbackForm.formState.isValid ||
                    feedbackForm.formState.isSubmitting
                  }
                  className="flex flex-row gap-2"
                >
                  {feedbackForm.formState.isSubmitting && (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  )}
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
