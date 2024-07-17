export function ChatUserTypingAnimation() {
  return (
    <div className="flex items-center justify-start space-x-1">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
    </div>
  );
}
