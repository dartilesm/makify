import { createNewChat } from "@/app/actions/create-new-chat";
import { Button, Input } from "@makify/ui";

export function NewChat() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden">
      <h1 className="text-4xl font-bold">Chat with PDF</h1>
      <form action={createNewChat} className="flex w-96 flex-row gap-2">
        <Input placeholder="Document url" name="document-url" />
        <Button type="submit">Start Chat</Button>
      </form>
    </div>
  );
}
