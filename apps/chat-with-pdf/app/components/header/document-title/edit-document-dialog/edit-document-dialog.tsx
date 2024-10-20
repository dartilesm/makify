"use client";

import { deleteChat } from "@/app/actions/delete-chat";
import { editChat } from "@/app/actions/edit-chat";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@makify/ui";
import { Tables } from "database.types";
import { LoaderCircleIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
});

function getDeleteFormSchema(documentId: string) {
  return z.object({
    documentId: z.string().refine((value) => value === documentId, {
      message: "Document ID does not match",
    }),
  });
}

export const enum EDIT_DOCUMENT_TAB {
  EDIT = "edit",
  DELETE = "delete",
}

type EditDocumentDialogProps = {
  isOpen: boolean;
  document: Tables<"Document">;
  defaultTab?: EDIT_DOCUMENT_TAB;
  onOpenChange?: (isOpen: boolean) => void;
};

export function EditDocumentDialog({
  isOpen,
  document,
  defaultTab = EDIT_DOCUMENT_TAB.EDIT,
  onOpenChange = () => null,
}: EditDocumentDialogProps) {
  const editForm = useForm<z.infer<typeof EditFormSchema>>({
    resolver: zodResolver(EditFormSchema),
    mode: "all",
    defaultValues: {
      title: document.name || "",
    },
    values: {
      title: document.name || "",
    },
  });

  const deleteForm = useForm<z.infer<ReturnType<typeof getDeleteFormSchema>>>({
    resolver: zodResolver(getDeleteFormSchema(document.chatId || "")),
    mode: "all",
    defaultValues: {
      documentId: "",
    },
  });

  useEffect(() => {
    editForm.reset();
    deleteForm.reset();
  }, [isOpen]);

  function handleDialogToggle(isOpen: boolean) {
    onOpenChange(isOpen);
  }

  async function onSaveChanges(values: z.infer<typeof EditFormSchema>) {
    await editChat(document, values.title);
    handleDialogToggle(false);
  }

  async function onDeleteDocument(
    values: z.infer<ReturnType<typeof getDeleteFormSchema>>,
  ) {
    await deleteChat(values.documentId);
    handleDialogToggle(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogToggle}>
      <DialogContent className="flex h-[360px] flex-col">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
          <DialogDescription>
            Edit the title or delete the document.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1">
          <Tabs defaultValue={defaultTab} className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                className="flex gap-2"
                value={EDIT_DOCUMENT_TAB.EDIT}
              >
                <PencilIcon className="h-4 w-4" />
                Edit zone
              </TabsTrigger>
              <TabsTrigger
                className="flex gap-2"
                value={EDIT_DOCUMENT_TAB.DELETE}
              >
                <TrashIcon className="h-4 w-4" />
                Danger zone
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex-1" value={EDIT_DOCUMENT_TAB.EDIT}>
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(onSaveChanges)}
                  className="flex h-full flex-col justify-between space-y-3"
                >
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormDescription>
                          This the title of the document, give it a meaningful
                          name.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Document title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="flex gap-2"
                      disabled={
                        !editForm.formState.isValid ||
                        editForm.formState.isSubmitting ||
                        document.name === editForm.getValues().title
                      }
                    >
                      {editForm.formState.isSubmitting && (
                        <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                      )}
                      Save changes
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent className="flex-1" value={EDIT_DOCUMENT_TAB.DELETE}>
              <Form {...deleteForm}>
                <form
                  onSubmit={deleteForm.handleSubmit(onDeleteDocument)}
                  className="flex h-full flex-col justify-between space-y-3"
                >
                  <FormField
                    control={deleteForm.control}
                    name="documentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delete document</FormLabel>
                        <FormDescription>
                          This action is irreversible, be careful.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Document ID..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Type{" "}
                          <span className="font-bold">{document.chatId}</span>{" "}
                          to delete the document.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      className="flex gap-2"
                      disabled={
                        !deleteForm.formState.isValid ||
                        deleteForm.formState.isSubmitting
                      }
                    >
                      {!deleteForm.formState.isSubmitting && (
                        <TrashIcon className="h-4 w-4" />
                      )}
                      {deleteForm.formState.isSubmitting && (
                        <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                      )}
                      Delete document
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
